package FoodApp.com.example.FoodAppdemo.dto;

import lombok.Data;

@Data
public class PlaceOrderRequestDTO {
    private String foodId;
    private String size;
    private int quantity;
}

