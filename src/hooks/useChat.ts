import { useState, useCallback, useRef, useEffect } from "react";
import { getStoredToken } from "@/lib/auth";
import type { TripData } from "@/data/tripData";

const API_BASE = "https://internal-api.emiratesescape.com/v1.0";

// ============================================
// TYPES
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
}

interface SSEEvent {
  type: "token" | "trip_data" | "generating" | "done" | "error";
  content?: string | boolean | Record<string, unknown>;
}

interface ConversationState {
  id: string | null;
  tripId: string | null;
  messages: ChatMessage[];
}

interface UseChatOptions {
  mode: "create" | "modify";
  tripId?: string | null;
  tripData?: TripData | null;
  onTripGenerated?: (trip: TripData) => void;
  onGeneratingChange?: (generating: boolean) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  requiresAuth: boolean;
  sendMessage: (text: string) => Promise<void>;
  loadConversation: (tripId: string) => Promise<void>;
  isLoadingHistory: boolean;
  checkAuth: () => boolean;
}

// ============================================
// HOOK
// ============================================

export function useChat(options: UseChatOptions): UseChatReturn {
  const { mode, tripId, tripData, onTripGenerated, onGeneratingChange } =
    options;

  const [conversation, setConversation] = useState<ConversationState>({
    id: null,
    tripId: tripId ?? null,
    messages: [],
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(!getStoredToken());
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    conversationIdRef.current = conversation.id;
  }, [conversation.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Ensure a conversation exists (create or fetch existing)
  const ensureConversation = useCallback(async (): Promise<string> => {
    if (conversationIdRef.current) return conversationIdRef.current;

    const token = getStoredToken();
    if (!token) {
      setRequiresAuth(true);
      throw new Error("AUTH_REQUIRED");
    }

    const response = await fetch(`${API_BASE}/chat/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        trip_id: tripId || undefined,
        mode,
      }),
    });

    if (response.status === 401) {
      setRequiresAuth(true);
      throw new Error("AUTH_REQUIRED");
    }
    if (!response.ok) throw new Error("Failed to create conversation");

    const data = await response.json();

    // If existing conversation returned with messages, load them
    if (data.messages?.length > 0) {
      const msgs: ChatMessage[] = data.messages
        .filter((m: { role: string }) => m.role !== "system")
        .map((m: { id: string; role: string; content: string; metadata?: Record<string, unknown> }) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          metadata: m.metadata,
        }));
      setConversation({
        id: data.id,
        tripId: data.trip_id,
        messages: msgs,
      });
    } else {
      setConversation((prev) => ({ ...prev, id: data.id }));
    }

    conversationIdRef.current = data.id;
    return data.id;
  }, [tripId, mode]);

  // Load existing conversation history for a trip
  const loadConversation = useCallback(async (loadTripId: string) => {
    const token = getStoredToken();
    if (!token) return;

    setIsLoadingHistory(true);
    try {
      const response = await fetch(
        `${API_BASE}/chat/conversations/${loadTripId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        const msgs: ChatMessage[] = data.messages
          .filter((m: { role: string }) => m.role !== "system")
          .map((m: { id: string; role: string; content: string; metadata?: Record<string, unknown> }) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            metadata: m.metadata,
          }));
        setConversation({
          id: data.id,
          tripId: data.trip_id,
          messages: msgs,
        });
        conversationIdRef.current = data.id;
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Send a message and handle SSE streaming response
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      setError(null);
      const trimmedText = text.trim();

      // Add user message to state immediately (optimistic)
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedText,
      };
      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg],
      }));

      setIsStreaming(true);
      setStreamingContent("");

      try {
        const conversationId = await ensureConversation();
        const token = getStoredToken();
        if (!token) {
          setRequiresAuth(true);
          throw new Error("AUTH_REQUIRED");
        }

        // Abort any previous in-flight stream
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const response = await fetch(`${API_BASE}/chat/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: trimmedText,
            context:
              mode === "modify" && tripData
                ? { trip_data: tripData }
                : undefined,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Chat request failed: ${response.statusText}`);
        }

        // Read SSE stream via ReadableStream
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedVisible = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines from buffer
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const event: SSEEvent = JSON.parse(jsonStr);

              switch (event.type) {
                case "token": {
                  const tokenText = event.content as string;
                  accumulatedVisible += tokenText;
                  setStreamingContent(accumulatedVisible);
                  break;
                }

                case "generating": {
                  onGeneratingChange?.(true);
                  break;
                }

                case "trip_data": {
                  const tripJson = event.content as unknown as TripData;
                  onTripGenerated?.(tripJson);
                  onGeneratingChange?.(false);
                  break;
                }

                case "error":
                  setError(event.content as string);
                  break;

                case "done":
                  break;
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }

        // Finalize: add assistant message to conversation state
        if (accumulatedVisible.trim()) {
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: accumulatedVisible.trim(),
          };
          setConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, assistantMsg],
          }));
        }
        setStreamingContent("");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        // Auth error: roll back the optimistic user message, don't show error banner
        if (err instanceof Error && err.message === "AUTH_REQUIRED") {
          setConversation((prev) => ({
            ...prev,
            messages: prev.messages.filter((m) => m.id !== userMsg.id),
          }));
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to send message";
        setError(message);
      } finally {
        setIsStreaming(false);
      }
    },
    [
      isStreaming,
      ensureConversation,
      mode,
      tripData,
      onTripGenerated,
      onGeneratingChange,
    ]
  );

  // Re-check auth state (e.g., after user logs in without remounting)
  const checkAuth = useCallback(() => {
    const hasToken = !!getStoredToken();
    setRequiresAuth(!hasToken);
    return hasToken;
  }, []);

  return {
    messages: conversation.messages,
    isStreaming,
    streamingContent,
    error,
    requiresAuth,
    sendMessage,
    loadConversation,
    isLoadingHistory,
    checkAuth,
  };
}
