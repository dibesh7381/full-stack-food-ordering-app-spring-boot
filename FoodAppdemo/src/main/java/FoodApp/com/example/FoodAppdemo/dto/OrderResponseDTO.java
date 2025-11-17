package FoodApp.com.example.FoodAppdemo.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private String orderId;
    private String foodName;
    private String size;
    private int quantity;
    private double price;
    private String createdAt;
}
