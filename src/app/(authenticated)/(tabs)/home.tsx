import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const API_URL =
  "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

export default function Home() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getProduct = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data } = await axios.get(API_URL);
      const sorted = data.sort(
        (a: ProductProps, b: ProductProps) => Number(b.id) - Number(a.id),
      );
      setProducts(sorted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProduct();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Anics</Text>
          <Text style={styles.subtitle}>Shared class feed</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/posts/create")}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#111827" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getProduct(true)}
            />
          }
        >
          {products.length === 0 ? (
            <Text style={styles.emptyText}>
              No posts yet. Be the first to share!
            </Text>
          ) : (
            products.map((product) => (
              <Pressable
                key={product.id}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/posts/[id]",
                    params: { id: product.id },
                  })
                }
              >
                {product.image ? (
                  <Image
                    source={{ uri: product.image }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                ) : null}

                <View style={styles.cardBody}>
                  <Text style={styles.postTitle}>{product.name}</Text>
                  <Text style={styles.postDescription}>
                    {product.description}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 20,
    gap: 14,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 190,
    backgroundColor: "#F3F4F6",
  },
  cardBody: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
});
