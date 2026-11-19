import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  multiline,
  ...props
}: InputProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-semibold text-slate-700">{label}</Text>
      <TextInput
        className={`rounded-2xl border bg-white px-4 text-base text-slate-900 ${
          multiline ? "min-h-28 py-3" : "h-14"
        } ${error ? "border-red-500" : "border-slate-300"}`}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        {...props}
      />
      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
    </View>
  );
}
