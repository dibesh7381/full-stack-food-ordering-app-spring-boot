package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private String id;
    private String username;
    private String email;
    private String role;
}
