

# 북끄북끄

> **중고 도서 거래 / 대여 및 추천 서비스**  

![logo](/uploads/41b0638b42507423dc78c24f941a60a9/logo.gif)

📽️ [시연 영상 바로가기]() 
📝 [회의록 보기](https://evergreen-frost-592.notion.site/1d501e071b1b80908df8d696e7c0d1dd?pvs=4)

<br>

## 목차

🌱 북끄북끄 서비스 소개
<br>
⏰ 개발 기간
<br>
💡 기획 배경
<br>
🎯 목표 및 주요 기능
<br>
🔧 기능 소개
<br>
📢 기술 스택 소개
<br>
🔍 시스템 아키텍처
<br>
💾 ERD 다이어그램
<br>

<br>

### ⏰ 개발 기간 (6주)
2025.04.14 ~ 2025.04.30 (2주) 기획, 설계
<br>
2025.05.01 ~ 20.05.22 (4주) 개발

<br>

### 💡 기획 배경

- 읽고 싶은 책이 많지만, 굳이 사고 싶지는 않을 때
- 내가 소장한 책을 다른 사람과 교환하고 싶을 때
- 나에게 맞는 맟춤형 책을 추천받고 싶을 때

**중고 도서를 대여/교환할 수 있고 맞춤형 도서까지 추천해주는, 북끄북끄**

<br>

### 🎯 목표 및 주요 기능

본 서비스는 중고 도서를 교환함으로써 지식을 선순환하며 독서 문화를 활성화하고자 하는 목표를 가집니다.
<br>
위시리스트 기반의 실시간 도서 매칭과 추천 서비스를 통해 사용자 맞춤형 서비스를 제공합니다.
<br>
또한, 북끄지수로 사용자 간 신뢰도를 측정하며 실시간 채팅을 통해 대면 거래를 활성화합니다.
<br>
결과적으로 단순한 도서 교환 플랫폼을 넘어, 지식과 경험을 나누는 소통의 창구로써의 역할을 가집니다.

<br>

### 🔧 기능 소개

서비스의 주요 기능들을 소개합니다.

#### ✅ 카카오 로그인
카카오 로그인을 통해서 서비스에 접근할 수 있습니다. 

<img src="/uploads/321a21091c6d9595a1aa5c40262ddf9f/KakaoTalk_20250519_110958856.jpg" width="200" height="150">

#### ✅ 책 등록
ISBN, 알라딘 책 검색, 직접 등록을 통해서 책을 등록할 수 있습니다. 

<img src="/uploads/cda2a0d163cc9356d6279df0a43e554b/KakaoTalk_20250519_110958856_02.jpg" width="200" height="150">

<img src="/uploads/f17667cee071510951d799f155050bc4/KakaoTalk_20250519_110958856_04.jpg" width="200" height="150">

<img src="/uploads/92aaa40d3d1b85f6c8cac5b7c8ddad17/KakaoTalk_20250519_110958856_05.jpg" width="200" height="150">

#### ✅ 나의 서재
등록한 서재를 내 전체 서재 탭을 통해 확인할 수 있습니다.
<br>
공개한 서재는 내 공개 서재 탭을 통해 확인할 수 있습니다.
<br>
공개 서재는 다른 유저들에게 보이게 됩니다.

<img src="/uploads/5231112c182aa22be4fdba6ec048a4a9/KakaoTalk_20250519_110958856_01.jpg" width="200" height="150">

<img src="/uploads/e30ce0e05ce820bd2fe671b37de86a50/KakaoTalk_20250519_110958856_06.jpg" width="200" height="150">


#### ✅ 매칭
공개 서재를 기반으로 매칭률 순, 거리 순 필터를 통해 매칭된 이웃들을 둘러볼 수 있습니다.
<br>
이때, 매칭률은 북끄지수,거리,최근 활동성을 종합하여 나타냅니다.
<br>

<img src="/uploads/424296340d7df735c4d92921fe1b455e/KakaoTalk_20250519_110958856_07.jpg" width="200" height="150">
<img src="/uploads/60e1737c331f47b6ebc7d32fc2335daf/KakaoTalk_20250519_110958856_08.jpg" width="200" height="150">



#### ✅ 추천
사용자의 위시리스트, 도서 검색 활동을 기반으로 맞춤형 도서 TOP5를 제공합니다.
<br>
실시간 인기 검색어, 검색어 자동완성 또한 같이 볼 수 있습니다.

<img src="/uploads/2af8f6068732b9ba836c6313c6b19e83/KakaoTalk_20250519_110958856_09.jpg" width="200" height="150">
<img src="/uploads/9f7d220c12a686d40f2e10d8a9776b43/KakaoTalk_20250519_110958856_10.jpg" width="200" height="150">

#### ✅ 채팅
매칭된 이웃과 도서를 교환 또는 거래하고 싶은 경우 채팅을 통해 날짜를 정합니다.
<br>
책 교환하기를 선택하면 캘린더를 통해 교환할 당일날 약속을 잡을 수 있습니다.
<br>
책 대여하기를 선택하면 캘린더를 통해 대여할 시작일부터 반납일까지 약속을 잡을 수 있습니다.
<br>



#### ✅ 독서 기록
등록한 도서로 가장 인상적이였던 인용구와 독후감을 남길 수 있습니다.
<br> 
남긴 기록을 통해 책의 여정도 볼 수 있습니다.

#### ✅ 거래 기록

마이페이지에서 거래 약속 보기 탭을 통해 현재 거래 약속을 볼 수 있습니다.
<br>
또한, 거래 기록 탭을 통해 총 거래한 기록을 확인할 수 있습니다.



<br>

### 📢 기술 스택 소개

#### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=typescript&logoColor=000)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38B2AC?logo=tailwindcss)

#### Backend 
![Java](https://img.shields.io/badge/Java-17-blue?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen?logo=springboot)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C?logo=hibernate)
![Gradle](https://img.shields.io/badge/Gradle-7.6-02303A?logo=gradle)

#### Build & Deployment
![EC2](https://img.shields.io/badge/AWS%20EC2-t3.medium-FF9900?logo=amazonaws&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker--Compose-2496ED?logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-Automation-D24939?logo=jenkins)
![Nginx](https://img.shields.io/badge/Nginx-1.27.4-009639?logo=nginx)

#### Database & Cache
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7.2-DC382D?logo=redis)
![ElasticSearch](https://img.shields.io/badge/elasticsearch-7.2-DC382D?logo=elasticsearch)

#### Infrastructure
![Ubuntu](https://img.shields.io/badge/Ubuntu-22.04-E95420?logo=ubuntu)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-orange?logo=prometheus)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-F46800?logo=grafana)
![apachekafka](https://img.shields.io/badge/apachekafka-Dashboard-F46800?logo=apachekafka)


### 🔍 시스템 아키텍처

![image](/uploads/7e4a5b4ad04b7b02f038884dd4d75412/image.png){width=1276 height=520}

<br>
### 💾 ERD Diagram




<br>
### 👥 팀 소개 및 역할

버뮤다 삼각김밥 팀입니다!



| Frontend | Frontend | Frontend | Backend | Backend | Backend |
|--------------|--------------|--------------|--------------|----------|--------------|
| 순화 👑 | 민재 | 다혜 | 수비 | 정민 | 인혁혁 |

