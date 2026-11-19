import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "outline" | "danger";

interface BtnProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

const containerStyles: Record<Variant, string> = {
  primary: "bg-indigo-600",
  outline: "bg-transparent border-2 border-indigo-600",
  danger: "bg-red-500",
};

const textStyles: Record<Variant, string> = {
  primary: "text-white",
  outline: "text-indigo-600",
  danger: "text-white",
};

const spinnerColors: Record<Variant, string> = {
  primary: "#ffffff",
  outline: "#4f46e5",
  danger: "#ffffff",
};

export default function Button({
  label,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: BtnProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`h-14 flex-row items-center justify-center rounded-2xl ${containerStyles[variant]} ${isDisabled ? "opacity-60" : ""}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColors[variant]} />
      ) : (
        <Text
          className={`text-base font-extrabold uppercase tracking-wide ${textStyles[variant]}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
