package FoodApp.com.example.FoodAppdemo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;   // ⭐ Constructor injection (best practice)

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;

        // ✅ Extract JWT from cookie named "token"
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        // ✅ Validate token & authenticate user
        if (token != null && jwtUtil.isTokenValid(token)) {

            String email = jwtUtil.getEmailFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);  // ⭐ role from JWT claim

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Convert String → Authority
                var authorities = List.of(new SimpleGrantedAuthority(role));

                var authToken = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // ⭐ Set Security Context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}


