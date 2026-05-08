// utils/flattenDataWithDate.ts
export const flattenDataWithDate = (arr: any) => {
  if (!Array.isArray(arr)) return [];
  return arr.flatMap((item) =>
    (item.data || []).map((d: any) => ({
      ...d,
      date: item.date,
    }))
  );
};
