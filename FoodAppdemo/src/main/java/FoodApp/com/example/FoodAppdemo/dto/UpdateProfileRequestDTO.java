package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDTO {
    private String username;
    private String email;
}

