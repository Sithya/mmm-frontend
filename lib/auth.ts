import { apiClient } from "./api";

export type CurrentUser = {
    id: number;
    name?: string;
    email: string;
    is_admin: boolean;
};

export async function getCurrentUser() {
    return apiClient.get<CurrentUser>("/auth/me");
}

// export async function logout() {
//     try {
//         await apiClient.post("/auth/logout");
//     } catch { }
//     apiClient.setAuthToken(undefined);
// }
