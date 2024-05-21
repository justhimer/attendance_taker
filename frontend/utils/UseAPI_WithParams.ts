import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useAPI_WithParams = <T>(fn: (params: any) => Promise<T>, params: any) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn(params);
      setData(res);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAPI_WithParams;