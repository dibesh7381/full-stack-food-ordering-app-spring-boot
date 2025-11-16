package FoodApp.com.example.FoodAppdemo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "foods")
public class Food {

    @Id
    private String id;

    private String name;
    private String type;
    private String category;
    private String description;
    private String imageUrl;

    private String sellerId;   // ⭐ ADD THIS

    private List<FoodSize> sizes;
}

