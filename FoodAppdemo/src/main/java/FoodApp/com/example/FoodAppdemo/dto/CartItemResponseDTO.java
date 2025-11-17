package FoodApp.com.example.FoodAppdemo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {
    private String id;
    private String foodId;
    private String foodName;
    private String size;
    private int quantity;
    private double price;
    private String imageUrl;
}

