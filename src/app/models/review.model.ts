export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdDate: Date;
    placeId: number; // ID du lieu associé
    userId: number; // ID de l'utilisateur qui a posté le commentaire
    user?: { // Informations de l'utilisateur (optionnel)
      id: number;
      username: string;
      profilePicture: string;
    };
  }


  export interface LikeResponseDTO {
    id?: number; // Assuming the backend DTO has an ID
    userId: number;
    placeId: number;
    createdAt?: string; // Add fields based on your backend DTO
    // Add other fields as necessary
  }