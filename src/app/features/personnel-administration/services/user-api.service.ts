import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface UserEntity {
  id: number;
  code: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  async getUsers(): Promise<UserEntity[]> {
    return firstValueFrom(this.http.get<UserEntity[]>(this.apiUrl));
  }

  async getUserById(id: number): Promise<UserEntity> {
    return firstValueFrom(this.http.get<UserEntity>(`${this.apiUrl}/${id}`));
  }

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    return firstValueFrom(this.http.post<UserEntity>(this.apiUrl, userData));
  }

  async updateUser(id: number, userData: Partial<UserEntity>): Promise<UserEntity> {
    return firstValueFrom(this.http.put<UserEntity>(`${this.apiUrl}/${id}`, userData));
  }

  async deleteUser(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
