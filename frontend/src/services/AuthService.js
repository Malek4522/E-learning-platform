import { jwtDecode } from 'jwt-decode';

class AuthService {
  constructor() {
    this.accessToken = null;
    this.role = null;
  }

  // Save the access token in memory
  setAccessToken(token) {
    this.accessToken = token;
    if (!token) {
      this.role = null;
      return;
    }
    let decodedToken = jwtDecode(token);
    if (!decodedToken.role) {
      throw new Error('Token is missing role information');
    }
    this.role = decodedToken.role;
  }

  // Get the access token
  getAccessToken() {
    return this.accessToken;
  }

  getRole() {
    return this.role;
  }
}

const authService = new AuthService();
export default authService; 