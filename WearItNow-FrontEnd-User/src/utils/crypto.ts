export const encodeId = (id: number): string => {
    return btoa(id.toString()); // Chuyển đổi id thành chuỗi trước khi mã hóa
};

export const decodeId = (encodedId: string): number => {
    return Number(atob(encodedId)); // Giải mã ID và chuyển đổi thành số
};