interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface UserDataApiResponse {
  user: User;
}

interface UserStatusApiResponse {
  code: number;
  message: string;
  token: string;
  data: UserDataApiResponse;
}

export interface UserApiResponse {
  status: UserStatusApiResponse;
}

class UserAdapter {
  static fromApi(user: UserApiResponse) {
    return {
      id: user.status.data.user.id,
      email: user.status.data.user.email,
      name: user.status.data.user.name,
      roles: user.status.data.user.roles,
      token: user.status.token,
    };
  }

  static toApi(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
  }
}
export default UserAdapter;
