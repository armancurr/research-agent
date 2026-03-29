import { LaunchChatScreen } from "@/features/launch-chat/launch-chat-screen";

export default async function ChatRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;

  return <LaunchChatScreen runId={runId} />;
}
