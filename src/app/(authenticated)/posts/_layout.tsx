import { Stack } from "expo-router";

export default function PostsLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ headerTitle: "Create Post" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Post" }} />
    </Stack>
  );
}
