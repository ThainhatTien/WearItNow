
import axiosInstance from 'services/api.service';
import { User, UserGroup, UserGroupApiResponse } from 'types/DiscountTypes';


// Lấy tất cả các UserGroup
export const getUserGroups = async (): Promise<UserGroup[]> => {
    try {
      const response = await axiosInstance.get<UserGroupApiResponse<UserGroup[]>>('/user-groups/all');
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result.map(group => ({
          id: group.id,
          name: group.name,
          users: group.users.map(user => ({
            userId: user.userId,
            username: user.username,
            email: user.email,  // Thêm email
            phone: user.phone,  // Thêm phone
            lastname: user.lastname,
            firstname: user.firstname,
            gender: user.gender,
            address: user.address,
            dob: user.dob,
            roles: user.roles,
          })),
        }));
      }
      throw new Error("Dữ liệu nhóm người dùng không hợp lệ");
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhóm người dùng:", error);
      throw error;
    }
  };

  export const addUserGroup = async (name: string): Promise<UserGroup> => {
    try {
      const response = await axiosInstance.post<UserGroupApiResponse<UserGroup>>(
        '/user-groups/create', 
        null, 
        { params: { name } }  // Gửi name qua query string
      );
      if (response.data && response.data.result) {
        return response.data.result;
      }
      throw new Error("Không thể thêm nhóm người dùng");
    } catch (error) {
      console.error("Lỗi khi thêm nhóm người dùng:", error);
      throw error;
    }
  };
  
// Cập nhật nhóm người dùng
export const updateUserGroup = async (id: number, name: string): Promise<UserGroup> => {
    try {
      const response = await axiosInstance.put<UserGroupApiResponse<UserGroup>>(`/user-groups/update/${id}`, { name }); // Gửi name trong body
      if (response.data && response.data.result) {
        return response.data.result;
      }
      throw new Error("Không thể cập nhật nhóm người dùng");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhóm người dùng:", error);
      throw error;
    }
  };
  

// Xóa nhóm người dùng
export const deleteUserGroup = async (id: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete<UserGroupApiResponse<null>>(`/user-groups/delete/${id}`);
    if (response.data.code === 1000) {
      console.log(response.data.message);
    } else {
      throw new Error("Không thể xóa nhóm người dùng");
    }
  } catch (error) {
    console.error("Lỗi khi xóa nhóm người dùng:", error);
    throw error;
  }
};

// Lấy nhóm người dùng theo tên
export const getUserGroupByName = async (name: string): Promise<UserGroup> => {
  try {
    const response = await axiosInstance.get<UserGroupApiResponse<UserGroup>>('/user-groups/by-name', { params: { name } });
    if (response.data && response.data.result) {
      return response.data.result;
    }
    throw new Error("Không tìm thấy nhóm người dùng với tên này");
  } catch (error) {
    console.error("Lỗi khi lấy nhóm người dùng theo tên:", error);
      throw error;
  }
};
      
      
      
// API cập nhật thông tin người dùng
export const updateUser = async (user: User): Promise<User> => {
    try {
      const response = await axiosInstance.put<UserGroupApiResponse<User>>(`/users/update/${user.userId}`, user);
      if (response.data && response.data.result) {
        return response.data.result;
      }
      throw new Error("Không thể cập nhật thông tin người dùng");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  };
  