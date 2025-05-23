

# 북끄북끄

> **중고 도서 거래 / 대여 및 추천 서비스**  

![logo](./images/00.logo.gif)

📽️ [시연 영상 바로가기](https://drive.google.com/file/d/1mJb7Dtvg7D853WkUg7NKR2r8eR2tngaM/view) 
📝 [회의록 보기]()

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

<img src="./images/01.온보딩, 로그인.gif" width=200>

#### ✅ GPS 위치 설정
주변 이웃들과 매칭 될 수 있도도록 위치 정보를 저장합니다. GPS 기능을 사용해 현재 위치를 불러올 수 있습니다.

<img src="./images/02.gps주소.gif" width=200>

#### ✅ 책 등록
ISBN, 알라딘 책 검색, 직접 등록을 통해서 책을 등록할 수 있습니다. 

<img src="./images/04.서재,책등록-isbn인식-공개서재등록.gif" width=200>


#### ✅ 나의 서재
등록한 도서들을 내 전체 서재 탭을 통해 확인할 수 있습니다. 등록한 도서 중 교환이 가능한 서재는 공개 처리 합니다. 공개된 책들은 내 공개 서재 탭을 통해 확인할 수 있습니다. 공개 서재는 다른 유저들이 볼 수 있습니다.
<br>

<img src="./images/03.서재-도서공개비공개.gif" width=200>
<img src="./images/03-1.서재-전체.jpg" width=200>
<img src="./images/03-1.서재-공개.jpg" width=200>


#### ✅ 매칭
공개 서재를 기반으로 매칭률 순, 거리 순 정렬를 통해 매칭된 이웃들을 둘러볼 수 있습니다.
이때, 매칭률은 **거래 후 상호 평가 점수(북끄 지수),거리,최근 활동성**을 종합하여 나타냅니다.

정렬을 사용해 매칭 목록 보기
<br>

<img src="./images/05-1.매칭-거리순.jpg" width=200>
<img src="./images/05-2.매칭-매칭률순.jpg" width=200>

<br>
매칭된 상대나, 주변 이웃 서재 보기를 통해 다른 사람들의 공개 서재를 볼 수 있습니다.
<br>

<img src="./images/05.매칭-상대서재보기.gif" width=200>

#### ✅ 읽고 싶은 책 추천
사용자의 위시리스트, 도서 검색 활동을 기반으로 맞춤형 도서 TOP5를 제공합니다.

<img src="./images/06.매칭-추천.gif" width=200>

<br>
실시간 인기 검색어, 검색어 자동완성 또한 같이 볼 수 있습니다.
<br>
<img src="./images/07.매칭-읽고싶은책검색,자동완성,실검.gif" width=200>

<br>
사용자 경험 개선을 위해서 검색 시 오탈자 자동 보정으로 스마트 검색 기능을 구현하였습니다.
<br>
<img src="./images/08.매칭-읽고싶은책검색어보정.gif" width=200>

#### ✅ 채팅
매칭된 이웃과 도서를 교환 또는 거래하고 싶은 경우 채팅을 통해 연락할 수 있습니니다. 채팅에서는 사진 보내기, 일정 등록하기, 이모지 반응하기 기능을 제공합니다.

<img src="./images/11.채팅.gif" width=200>
<img src="./images/12.채팅-이미지업로드.gif" width=200>
<img src="./images/13.채팅-약속잡기.gif" width=200>
<img src="./images/14.채팅-이모지반응.gif" width=200>


<br>
일정 등록 시 책 교환과 대여 모두 지원합니다. 일정 등록 모달에서 책 교환하기를 선택하면 캘린더를 통해 교환할 당일날 약속을 잡을 수 있습니다.책 대여하기를 선택하면 캘린더를 통해 대여할 시작일부터 반납일까지 약속을 잡을 수 있습니다.
<br>

<img src="./images/13-1.채팅-교환일정잡기.png" width=200>
<img src="./images/13-1.채팅-대여일정잡기.png" width=200>

<br>
거래 완료 후 매너 평가를 통해 북끄 지수가 산출됩니다. 평가 시 거래 한 도서를 등록하면, 거래 도서가 내 서재에 자동 등록 됩니다.
<br>
<img src="./images/15.채팅-거래완료후평가.gif" width=200>

#### ✅ 독서 기록
등록한 도서로 가장 인상적이였던 인용구와 독후감을 남길 수 있습니다. 인용구 별자리 탭에서는 인용구들이 별처럼 밤하늘에 펼쳐진 모습을 볼 수 있습니다.

<img src="./images/16.독서기록-독서기록작성.gif" width=200>
<img src="./images/17.독서기록-인용구별자리.gif" width=200>
<br> 
책의 여정 탭에서 짧게 독서 후기를 남기고, 다른 사람들과 책 후기를 나눌 수 있습니다. 책의 여정에서도 후기를 남긴 책의 여정들을 3D 시각화 하여 볼 수 있습니다.

<img src="./images/18.독서기록-책의여정.gif" width=200>
<img src="./images/19.독서기록-책의여정맵.gif" width=200>
<img src="./images/19-1.책의여정-캡쳐.png" width=200>


#### ✅ 거래 기록

마이페이지에서 거래 약속 보기 탭을 통해 현재 거래 약속을 볼 수 있습니다. 또한, 거래 기록 탭을 통해 총 거래한 기록을 확인할 수 있습니다.

<img src="./images/20.마이페이지-거래기록보기.gif" width=200>
<img src="./images/21.마이페이지-거래약속보기.jpg" width=200>


#### ✅ 알림

매칭된 이웃, 채팅, 거래 전 확인 알림 등 알림을 통해 정보를 확인할 수 있습니다.

<img src="./images/22.알림-거래약속날짜알림.gif" width=200>
<img src="./images/21.마이페이지-거래약속보기.jpg" width=200>

<br>

### 📢 기술 스택 소개

#### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-ES6+-F7DF1E?logo=typescript&logoColor=000)
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

<img src="./images/시스템-아키텍쳐.png" width=1276>
<br>

### 💾 ERD Diagram

<img src="./images/erd.png" width=500>

<br>

### 👥 팀 소개 및 역할

버뮤다 삼각김밥 팀입니다!

<img src="./images/팀원소개.png" width=200>



| Frontend | Frontend | Frontend | Backend | Backend | Backend |
|--------------|--------------|--------------|--------------|----------|--------------|
| 순화 👑 | 민재 | 다혜 | 수비 | 정민 | 인혁 |

