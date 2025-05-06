package com.ssafy.bookshy.domain.users.dto;

import com.ssafy.bookshy.domain.users.entity.Users;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignUpDto {

    private String address;
    private int age;
    private Users.Gender gender;

}
