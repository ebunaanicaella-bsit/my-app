import { Trash2 } from "lucide-react-native";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type Props = {
  name: string;
  description: string;
  image?: string;
  onDelete?: () => void;
  deleting?: boolean;
};

export default function Card({
  name,
  description,
  image,
  onDelete,
  deleting = false,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {image ? (
        <Image
          source={{ uri: image }}
          className="h-44 w-full bg-slate-100"
          resizeMode="cover"
        />
      ) : null}
      <View className="flex-row items-start gap-3 p-4">
        <View className="flex-1 gap-1">
          <Text className="text-xl font-bold text-slate-900">{name}</Text>
          <Text className="text-sm text-slate-600">{description}</Text>
        </View>
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            disabled={deleting}
            hitSlop={10}
            accessibilityLabel="Delete post"
            className="h-10 w-10 items-center justify-center rounded-full bg-red-50"
          >
            {deleting ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <Trash2 size={20} color="#ef4444" />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
