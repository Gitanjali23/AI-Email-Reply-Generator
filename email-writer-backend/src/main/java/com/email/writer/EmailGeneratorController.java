package com.email.writer;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class EmailGeneratorController {

    private final EmailGeneratorServices emailGeneratorServices;

    public EmailGeneratorController(EmailGeneratorServices emailGeneratorServices) {
        this.emailGeneratorServices = emailGeneratorServices;
    }

    @PostMapping("/generate")
    public String generateEmail(@RequestBody EmailRequest request) {
        return emailGeneratorServices.generateEmailReply(request);
    }

    // ✅ YE CLASS KE ANDAR hona chahiye
    @GetMapping("/test")
    public String test() {
        return "Working";
    }
}