import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface RawgGame {
  id: number;
  name: string;
  background_image: string | null;
}

interface RawgResponse {
  count: number;
  next: string | null;
  results: RawgGame[];
}

export interface GameFromApi {
  rawgId: number;
  name: string;
  coverUrl: string | null;
}

@Injectable()
export class RawgClientService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.rawg.io/api';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('RAWG_API_KEY')!;
  }

  async searchGames(query: string, limit = 5): Promise<GameFromApi[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<RawgResponse>(`${this.baseUrl}/games`, {
          params: {
            key: this.apiKey,
            search: query,
            page_size: limit,
            search_precise: true,
          },
        }),
      );

      return response.data.results.map((g) => ({
        rawgId: g.id,
        name: g.name,
        coverUrl: g.background_image,
      }));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
