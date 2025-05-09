package com.ssafy.bookshy.domain.recommend.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {
    @Value("${elasticsearch.url}")
    private String elasticsearchUrl;  // "host:port" 형식으로 받을 것입니다

    @Bean(destroyMethod = "close")
    public RestHighLevelClient client() {
        // URL을 host와 port로 분리
        String[] hostAndPort = elasticsearchUrl.split(":");
        String host = hostAndPort[0];
        int port = Integer.parseInt(hostAndPort[1]);

        HttpHost httpHost = new HttpHost(host, port, "http");
        RestClientBuilder builder = RestClient.builder(httpHost);
        // 최종 클라이언트 객체 생성! 이거 가지고 ES에 쿼리 날릴 수 있음 ㄹㅇ 중요
        RestHighLevelClient client = new RestHighLevelClient(builder);
        return client;
    }
}