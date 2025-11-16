package FoodApp.com.example.FoodAppdemo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private String token;   // ⭐ JWT Token included
}

