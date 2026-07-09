package com.hexaware.automobileinsurance.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Handles requests to protected endpoints that are missing a valid JWT.
 * Returns a clean, user-readable 401 JSON response instead of the default
 * container error page.
 *
 * Note: this builds the JSON body manually (no Jackson ObjectMapper) since
 * the payload shape is small and fixed - this avoids any dependency on
 * com.fasterxml.jackson.databind being resolvable in this compilation unit.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String json = "{"
                + "\"timestamp\":\"" + escape(LocalDateTime.now().toString()) + "\","
                + "\"status\":" + HttpServletResponse.SC_UNAUTHORIZED + ","
                + "\"error\":\"Unauthorized\","
                + "\"message\":\"A valid JWT token is required to access this resource.\","
                + "\"path\":\"" + escape(request.getRequestURI()) + "\""
                + "}";

        response.getWriter().write(json);
    }

    /**
     * Minimal JSON string escaping for the values we interpolate above
     * (timestamp and request path). Prevents malformed JSON if either
     * value ever contains a quote or backslash.
     */
    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}