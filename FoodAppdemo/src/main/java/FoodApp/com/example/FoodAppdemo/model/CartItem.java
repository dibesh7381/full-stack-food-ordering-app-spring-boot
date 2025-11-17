package FoodApp.com.example.FoodAppdemo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cart_items")
public class CartItem {

    @Id
    private String id;

    private String userId;
    private String foodId;
    private String foodName;
    private String size;
    private int quantity;
    private double price;
    private String imageUrl;
}

