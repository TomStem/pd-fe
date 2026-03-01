import { ref } from "vue";
import axios from "axios";

export const usePosts = () => {
  const posts = ref([]);
  const loading = ref(true);

  const fetchPosts = async () => {
    loading.value = true;
    const res = await axios.get(
      "https://yourwordpress.com/wp-json/wp/v2/posts",
    );
    posts.value = res.data;
    loading.value = false;
  };

  return { posts, loading, fetchPosts };
};
