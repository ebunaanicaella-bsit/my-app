import { Tabs } from "expo-router";
import { Home, User } from "lucide-react-native";

const PRIMARY = "#4f46e5";
const INACTIVE = "#94a3b8";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: PRIMARY },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "800", fontSize: 20, color: "#ffffff" },
        headerShadowVisible: false,

        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          paddingTop: 6,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Home color={color} size={size} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <User color={color} size={size} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
