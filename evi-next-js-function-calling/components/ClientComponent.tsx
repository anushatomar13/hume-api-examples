"use client";
import {
  VoiceProvider,
  ToolCall,
  ToolCallHandler,
  ToolResponse,
  ToolError,
} from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";

const handleToolCall: ToolCallHandler = async (
  toolCall: ToolCall
): Promise<ToolResponse | ToolError> => {
  console.log("Tool call received", toolCall);

  if (toolCall.name === 'virtual_therapist') {
    try {
      // Parse the parameters if needed
      const args = JSON.parse(toolCall.parameters) as {
        prompt: string;
      };

      // Example of a possible interaction
      // Customize this as per the requirements of the virtual therapist
      const responseContent = Yuri says: I understand you're feeling ${args.prompt}, let's talk more about it.;

      return {
        type: 'tool_response',
        tool_call_id: toolCall.tool_call_id,
        content: JSON.stringify({ message: responseContent }),
      };
    } catch (error) {
      return {
        type: 'tool_error',
        tool_call_id: toolCall.tool_call_id,
        error: 'Virtual therapist tool error',
        code: 'virtual_therapist_error',
        level: 'warn',
        content: 'There was an error with the virtual therapist tool',
      };
    }
  } else {
    return {
      type: 'tool_error',
      tool_call_id: toolCall.tool_call_id,
      error: 'Tool not found',
      code: 'tool_not_found',
      level: 'warn',
      content: 'The tool you requested was not found',
    };
  }
};

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  return (
    <VoiceProvider
      configId={process.env.NEXT_PUBLIC_HUME_CONFIG_ID} 
      auth={{ type: "accessToken", value: accessToken }}
      onToolCall={handleToolCall}
      onMessage={(message: unknown) => console.log(message)}
    >
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}