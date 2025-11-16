package FoodApp.com.example.FoodAppdemo.dto;

import lombok.Data;
import java.util.List;

@Data
public class AddFoodRequest {
        private String name;
        private String type;
        private String category;
        private String description;
        private String imageBase64;  // ⭐ BASE64 STRING

        private List<FoodSizeDTO> sizes;
    }

