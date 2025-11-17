package FoodApp.com.example.FoodAppdemo.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDTO {
    private String id;
    private String message;
    private String createdAt;
    private boolean isRead;
}

