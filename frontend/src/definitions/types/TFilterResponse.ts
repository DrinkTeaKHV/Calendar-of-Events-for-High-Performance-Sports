// Тип для участника с количеством
export interface ParticipantsCount {
    participants_count: number;
    count: number;
}

// Основной интерфейс для ответа
export interface TFilterOptionsResponse {
    sports: string[];
    competition_types: string[];
    locations: string[];
    genders: string[];
    participants_counts: ParticipantsCount[];
}
