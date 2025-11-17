package FoodApp.com.example.FoodAppdemo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequestDTO {
    private String foodId;
    private String size;
    private int quantity;
}

