PGDMP                      }            d204     15.12 (Debian 15.12-1.pgdg120+1)    17.0 j    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16384    d204    DATABASE     o   CREATE DATABASE d204 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE d204;
                     bookshy    false            e           1247    16537    request_status_enum    TYPE     s   CREATE TYPE public.request_status_enum AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'COMPLETED'
);
 &   DROP TYPE public.request_status_enum;
       public               bookshy    false            �           1247    36926    requeststatus    TYPE     m   CREATE TYPE public.requeststatus AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'COMPLETED'
);
     DROP TYPE public.requeststatus;
       public               bookshy    false            �           2605    36936 0   CAST (public.requeststatus AS character varying)    CAST     P   CREATE CAST (public.requeststatus AS character varying) WITH INOUT AS IMPLICIT;
 7   DROP CAST (public.requeststatus AS character varying);
                        false    899            m           2605    36935 0   CAST (character varying AS public.requeststatus)    CAST     P   CREATE CAST (character varying AS public.requeststatus) WITH INOUT AS IMPLICIT;
 7   DROP CAST (character varying AS public.requeststatus);
                        false    899            �            1259    16786    book_quotes    TABLE     �   CREATE TABLE public.book_quotes (
    book_id bigint,
    created_at timestamp(6) without time zone,
    quote_id bigint NOT NULL,
    user_id bigint,
    content character varying(255)
);
    DROP TABLE public.book_quotes;
       public         heap r       bookshy    false            �            1259    16785    book_quotes_quote_id_seq    SEQUENCE     �   CREATE SEQUENCE public.book_quotes_quote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.book_quotes_quote_id_seq;
       public               bookshy    false    221            �           0    0    book_quotes_quote_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.book_quotes_quote_id_seq OWNED BY public.book_quotes.quote_id;
          public               bookshy    false    220            �            1259    27740 	   book_trip    TABLE     �   CREATE TABLE public.book_trip (
    trip_id bigint NOT NULL,
    book_id bigint,
    content text NOT NULL,
    created_at timestamp(6) without time zone,
    user_id bigint
);
    DROP TABLE public.book_trip;
       public         heap r       bookshy    false            �            1259    27739    book_trip_trip_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.book_trip_trip_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.book_trip_trip_id_seq;
       public               bookshy    false    231            �           0    0    book_trip_trip_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.book_trip_trip_id_seq OWNED BY public.book_trip.trip_id;
          public               bookshy    false    230            �            1259    16800    books    TABLE     �  CREATE TABLE public.books (
    exchange_count integer,
    pub_date date,
    book_id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    author character varying(255),
    cover_image_url character varying(255),
    description character varying(255),
    isbn character varying(255) NOT NULL,
    publisher character varying(255),
    status character varying(255),
    title character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    category character varying(255),
    page_count integer,
    item_id bigint,
    CONSTRAINT books_status_check CHECK (((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'EXCHANGING'::character varying, 'EXCHANGED'::character varying])::text[])))
);
    DROP TABLE public.books;
       public         heap r       bookshy    false            �            1259    16799    books_book_id_seq    SEQUENCE     z   CREATE SEQUENCE public.books_book_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.books_book_id_seq;
       public               bookshy    false    223            �           0    0    books_book_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;
          public               bookshy    false    222            �            1259    16829 	   chat_room    TABLE     =  CREATE TABLE public.chat_room (
    created_at timestamp(6) without time zone,
    id bigint NOT NULL,
    last_message_timestamp timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    user_a_id bigint,
    user_b_id bigint,
    last_message character varying(255),
    match_id bigint
);
    DROP TABLE public.chat_room;
       public         heap r       bookshy    false            �            1259    16828    chat_room_id_seq    SEQUENCE     y   CREATE SEQUENCE public.chat_room_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.chat_room_id_seq;
       public               bookshy    false    225            �           0    0    chat_room_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.chat_room_id_seq OWNED BY public.chat_room.id;
          public               bookshy    false    224            �            1259    16500    exchange_requests    TABLE     0  CREATE TABLE public.exchange_requests (
    request_id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    requested_at timestamp(6) without time zone,
    requester_id bigint,
    responder_id bigint,
    type character varying(255),
    book_a_id bigint,
    book_b_id bigint,
    status public.request_status_enum,
    chat_room_id bigint,
    CONSTRAINT exchange_requests_type_check CHECK (((type)::text = ANY ((ARRAY['EXCHANGE'::character varying, 'RENTAL'::character varying])::text[])))
);
 %   DROP TABLE public.exchange_requests;
       public         heap r       bookshy    false    869            �            1259    16499     exchange_requests_request_id_seq    SEQUENCE     �   CREATE SEQUENCE public.exchange_requests_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.exchange_requests_request_id_seq;
       public               bookshy    false    215            �           0    0     exchange_requests_request_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.exchange_requests_request_id_seq OWNED BY public.exchange_requests.request_id;
          public               bookshy    false    214            �            1259    16511    exchange_requests_reviews    TABLE     r  CREATE TABLE public.exchange_requests_reviews (
    review_id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    rating double precision,
    request_id bigint,
    reviewee_id bigint,
    reviewer_id bigint,
    condition integer NOT NULL,
    manner integer NOT NULL,
    punctuality integer NOT NULL
);
 -   DROP TABLE public.exchange_requests_reviews;
       public         heap r       bookshy    false            �            1259    16510 '   exchange_requests_reviews_review_id_seq    SEQUENCE     �   CREATE SEQUENCE public.exchange_requests_reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.exchange_requests_reviews_review_id_seq;
       public               bookshy    false    217            �           0    0 '   exchange_requests_reviews_review_id_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.exchange_requests_reviews_review_id_seq OWNED BY public.exchange_requests_reviews.review_id;
          public               bookshy    false    216            �            1259    32988    exchange_reviews_books    TABLE       CREATE TABLE public.exchange_reviews_books (
    id bigint NOT NULL,
    aladin_item_id bigint,
    book_id bigint,
    from_matching boolean NOT NULL,
    library_id bigint,
    review_id bigint,
    owner_id bigint NOT NULL,
    request_id bigint NOT NULL
);
 *   DROP TABLE public.exchange_reviews_books;
       public         heap r       bookshy    false            �            1259    32987    exchange_reviews_books_id_seq    SEQUENCE     �   CREATE SEQUENCE public.exchange_reviews_books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.exchange_reviews_books_id_seq;
       public               bookshy    false    235            �           0    0    exchange_reviews_books_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.exchange_reviews_books_id_seq OWNED BY public.exchange_reviews_books.id;
          public               bookshy    false    234            �            1259    16518 	   libraries    TABLE     �   CREATE TABLE public.libraries (
    library_id bigint NOT NULL,
    is_public boolean NOT NULL,
    registered_at timestamp(6) without time zone,
    book_id bigint NOT NULL,
    user_id bigint NOT NULL
);
    DROP TABLE public.libraries;
       public         heap r       bookshy    false            �            1259    16517    libraries_library_id_seq    SEQUENCE     �   CREATE SEQUENCE public.libraries_library_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.libraries_library_id_seq;
       public               bookshy    false    219            �           0    0    libraries_library_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.libraries_library_id_seq OWNED BY public.libraries.library_id;
          public               bookshy    false    218            �            1259    34032    library_read_log    TABLE     �   CREATE TABLE public.library_read_log (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    book_id bigint NOT NULL,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 $   DROP TABLE public.library_read_log;
       public         heap r       bookshy    false            �            1259    34031    library_read_log_id_seq    SEQUENCE     �   CREATE SEQUENCE public.library_read_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.library_read_log_id_seq;
       public               bookshy    false    237            �           0    0    library_read_log_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.library_read_log_id_seq OWNED BY public.library_read_log.id;
          public               bookshy    false    236            �            1259    16836    matching    TABLE     r  CREATE TABLE public.matching (
    match_id bigint NOT NULL,
    matched_at timestamp(6) without time zone,
    status character varying(255),
    receiver_id bigint,
    sender_id bigint,
    CONSTRAINT matching_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'REJECTED'::character varying])::text[])))
);
    DROP TABLE public.matching;
       public         heap r       bookshy    false            �            1259    30104    matching_books    TABLE     /  CREATE TABLE public.matching_books (
    id bigint NOT NULL,
    role character varying(255),
    book_id bigint,
    match_id bigint,
    user_id bigint,
    CONSTRAINT matching_books_role_check CHECK (((role)::text = ANY ((ARRAY['GIVE'::character varying, 'RECEIVE'::character varying])::text[])))
);
 "   DROP TABLE public.matching_books;
       public         heap r       bookshy    false            �            1259    30103    matching_books_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.matching_books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.matching_books_id_seq;
       public               bookshy    false    233            �           0    0    matching_books_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.matching_books_id_seq OWNED BY public.matching_books.id;
          public               bookshy    false    232            �            1259    16835    matching_match_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.matching_match_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.matching_match_id_seq;
       public               bookshy    false    227            �           0    0    matching_match_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.matching_match_id_seq OWNED BY public.matching.match_id;
          public               bookshy    false    226            �            1259    16844    users    TABLE     �  CREATE TABLE public.users (
    age integer,
    temperature real,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    user_id bigint NOT NULL,
    nickname character varying(100) NOT NULL,
    address character varying(255),
    badges character varying(255),
    email character varying(255),
    fcm_token character varying(255),
    gender character varying(255),
    profile_image_url text,
    refresh_token character varying(255),
    latitude double precision,
    longitude double precision,
    last_active_at timestamp(6) without time zone,
    CONSTRAINT users_gender_check CHECK (((gender)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       bookshy    false            �            1259    16843    users_user_id_seq    SEQUENCE     z   CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public               bookshy    false    229            �           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public               bookshy    false    228            �           2604    16789    book_quotes quote_id    DEFAULT     |   ALTER TABLE ONLY public.book_quotes ALTER COLUMN quote_id SET DEFAULT nextval('public.book_quotes_quote_id_seq'::regclass);
 C   ALTER TABLE public.book_quotes ALTER COLUMN quote_id DROP DEFAULT;
       public               bookshy    false    220    221    221            �           2604    27743    book_trip trip_id    DEFAULT     v   ALTER TABLE ONLY public.book_trip ALTER COLUMN trip_id SET DEFAULT nextval('public.book_trip_trip_id_seq'::regclass);
 @   ALTER TABLE public.book_trip ALTER COLUMN trip_id DROP DEFAULT;
       public               bookshy    false    230    231    231            �           2604    16803    books book_id    DEFAULT     n   ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);
 <   ALTER TABLE public.books ALTER COLUMN book_id DROP DEFAULT;
       public               bookshy    false    223    222    223            �           2604    16832    chat_room id    DEFAULT     l   ALTER TABLE ONLY public.chat_room ALTER COLUMN id SET DEFAULT nextval('public.chat_room_id_seq'::regclass);
 ;   ALTER TABLE public.chat_room ALTER COLUMN id DROP DEFAULT;
       public               bookshy    false    224    225    225            �           2604    16503    exchange_requests request_id    DEFAULT     �   ALTER TABLE ONLY public.exchange_requests ALTER COLUMN request_id SET DEFAULT nextval('public.exchange_requests_request_id_seq'::regclass);
 K   ALTER TABLE public.exchange_requests ALTER COLUMN request_id DROP DEFAULT;
       public               bookshy    false    214    215    215            �           2604    16514 #   exchange_requests_reviews review_id    DEFAULT     �   ALTER TABLE ONLY public.exchange_requests_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.exchange_requests_reviews_review_id_seq'::regclass);
 R   ALTER TABLE public.exchange_requests_reviews ALTER COLUMN review_id DROP DEFAULT;
       public               bookshy    false    216    217    217            �           2604    32991    exchange_reviews_books id    DEFAULT     �   ALTER TABLE ONLY public.exchange_reviews_books ALTER COLUMN id SET DEFAULT nextval('public.exchange_reviews_books_id_seq'::regclass);
 H   ALTER TABLE public.exchange_reviews_books ALTER COLUMN id DROP DEFAULT;
       public               bookshy    false    235    234    235            �           2604    16521    libraries library_id    DEFAULT     |   ALTER TABLE ONLY public.libraries ALTER COLUMN library_id SET DEFAULT nextval('public.libraries_library_id_seq'::regclass);
 C   ALTER TABLE public.libraries ALTER COLUMN library_id DROP DEFAULT;
       public               bookshy    false    219    218    219            �           2604    34035    library_read_log id    DEFAULT     z   ALTER TABLE ONLY public.library_read_log ALTER COLUMN id SET DEFAULT nextval('public.library_read_log_id_seq'::regclass);
 B   ALTER TABLE public.library_read_log ALTER COLUMN id DROP DEFAULT;
       public               bookshy    false    236    237    237            �           2604    16839    matching match_id    DEFAULT     v   ALTER TABLE ONLY public.matching ALTER COLUMN match_id SET DEFAULT nextval('public.matching_match_id_seq'::regclass);
 @   ALTER TABLE public.matching ALTER COLUMN match_id DROP DEFAULT;
       public               bookshy    false    226    227    227            �           2604    30107    matching_books id    DEFAULT     v   ALTER TABLE ONLY public.matching_books ALTER COLUMN id SET DEFAULT nextval('public.matching_books_id_seq'::regclass);
 @   ALTER TABLE public.matching_books ALTER COLUMN id DROP DEFAULT;
       public               bookshy    false    232    233    233            �           2604    16847    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               bookshy    false    229    228    229            �          0    16786    book_quotes 
   TABLE DATA           V   COPY public.book_quotes (book_id, created_at, quote_id, user_id, content) FROM stdin;
    public               bookshy    false    221   A�       �          0    27740 	   book_trip 
   TABLE DATA           S   COPY public.book_trip (trip_id, book_id, content, created_at, user_id) FROM stdin;
    public               bookshy    false    231   ^�       �          0    16800    books 
   TABLE DATA           �   COPY public.books (exchange_count, pub_date, book_id, created_at, author, cover_image_url, description, isbn, publisher, status, title, user_id, category, page_count, item_id) FROM stdin;
    public               bookshy    false    223   {�       �          0    16829 	   chat_room 
   TABLE DATA           �   COPY public.chat_room (created_at, id, last_message_timestamp, updated_at, user_a_id, user_b_id, last_message, match_id) FROM stdin;
    public               bookshy    false    225   ��       �          0    16500    exchange_requests 
   TABLE DATA           �   COPY public.exchange_requests (request_id, created_at, updated_at, requested_at, requester_id, responder_id, type, book_a_id, book_b_id, status, chat_room_id) FROM stdin;
    public               bookshy    false    215   ��       �          0    16511    exchange_requests_reviews 
   TABLE DATA           �   COPY public.exchange_requests_reviews (review_id, created_at, updated_at, rating, request_id, reviewee_id, reviewer_id, condition, manner, punctuality) FROM stdin;
    public               bookshy    false    217   ҋ       �          0    32988    exchange_reviews_books 
   TABLE DATA           �   COPY public.exchange_reviews_books (id, aladin_item_id, book_id, from_matching, library_id, review_id, owner_id, request_id) FROM stdin;
    public               bookshy    false    235   �       �          0    16518 	   libraries 
   TABLE DATA           [   COPY public.libraries (library_id, is_public, registered_at, book_id, user_id) FROM stdin;
    public               bookshy    false    219   �       �          0    34032    library_read_log 
   TABLE DATA           O   COPY public.library_read_log (id, user_id, book_id, registered_at) FROM stdin;
    public               bookshy    false    237   )�       �          0    16836    matching 
   TABLE DATA           X   COPY public.matching (match_id, matched_at, status, receiver_id, sender_id) FROM stdin;
    public               bookshy    false    227   F�       �          0    30104    matching_books 
   TABLE DATA           N   COPY public.matching_books (id, role, book_id, match_id, user_id) FROM stdin;
    public               bookshy    false    233   c�       �          0    16844    users 
   TABLE DATA           �   COPY public.users (age, temperature, created_at, updated_at, user_id, nickname, address, badges, email, fcm_token, gender, profile_image_url, refresh_token, latitude, longitude, last_active_at) FROM stdin;
    public               bookshy    false    229   ��       �           0    0    book_quotes_quote_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.book_quotes_quote_id_seq', 72, true);
          public               bookshy    false    220            �           0    0    book_trip_trip_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.book_trip_trip_id_seq', 65, true);
          public               bookshy    false    230            �           0    0    books_book_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.books_book_id_seq', 467, true);
          public               bookshy    false    222            �           0    0    chat_room_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.chat_room_id_seq', 123, true);
          public               bookshy    false    224            �           0    0     exchange_requests_request_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.exchange_requests_request_id_seq', 56, true);
          public               bookshy    false    214            �           0    0 '   exchange_requests_reviews_review_id_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.exchange_requests_reviews_review_id_seq', 41, true);
          public               bookshy    false    216            �           0    0    exchange_reviews_books_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.exchange_reviews_books_id_seq', 41, true);
          public               bookshy    false    234            �           0    0    libraries_library_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.libraries_library_id_seq', 413, true);
          public               bookshy    false    218            �           0    0    library_read_log_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.library_read_log_id_seq', 260, true);
          public               bookshy    false    236            �           0    0    matching_books_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.matching_books_id_seq', 1, false);
          public               bookshy    false    232            �           0    0    matching_match_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.matching_match_id_seq', 109, true);
          public               bookshy    false    226            �           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 25, true);
          public               bookshy    false    228            �           2606    16791    book_quotes book_quotes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.book_quotes
    ADD CONSTRAINT book_quotes_pkey PRIMARY KEY (quote_id);
 F   ALTER TABLE ONLY public.book_quotes DROP CONSTRAINT book_quotes_pkey;
       public                 bookshy    false    221            �           2606    27747    book_trip book_trip_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.book_trip
    ADD CONSTRAINT book_trip_pkey PRIMARY KEY (trip_id);
 B   ALTER TABLE ONLY public.book_trip DROP CONSTRAINT book_trip_pkey;
       public                 bookshy    false    231            �           2606    16808    books books_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public                 bookshy    false    223            �           2606    16834    chat_room chat_room_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT chat_room_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.chat_room DROP CONSTRAINT chat_room_pkey;
       public                 bookshy    false    225            �           2606    16509 (   exchange_requests exchange_requests_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.exchange_requests
    ADD CONSTRAINT exchange_requests_pkey PRIMARY KEY (request_id);
 R   ALTER TABLE ONLY public.exchange_requests DROP CONSTRAINT exchange_requests_pkey;
       public                 bookshy    false    215            �           2606    16516 8   exchange_requests_reviews exchange_requests_reviews_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.exchange_requests_reviews
    ADD CONSTRAINT exchange_requests_reviews_pkey PRIMARY KEY (review_id);
 b   ALTER TABLE ONLY public.exchange_requests_reviews DROP CONSTRAINT exchange_requests_reviews_pkey;
       public                 bookshy    false    217            �           2606    32993 2   exchange_reviews_books exchange_reviews_books_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.exchange_reviews_books
    ADD CONSTRAINT exchange_reviews_books_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.exchange_reviews_books DROP CONSTRAINT exchange_reviews_books_pkey;
       public                 bookshy    false    235            �           2606    16523    libraries libraries_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT libraries_pkey PRIMARY KEY (library_id);
 B   ALTER TABLE ONLY public.libraries DROP CONSTRAINT libraries_pkey;
       public                 bookshy    false    219            �           2606    34038 &   library_read_log library_read_log_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.library_read_log
    ADD CONSTRAINT library_read_log_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.library_read_log DROP CONSTRAINT library_read_log_pkey;
       public                 bookshy    false    237            �           2606    34040 5   library_read_log library_read_log_user_id_book_id_key 
   CONSTRAINT     |   ALTER TABLE ONLY public.library_read_log
    ADD CONSTRAINT library_read_log_user_id_book_id_key UNIQUE (user_id, book_id);
 _   ALTER TABLE ONLY public.library_read_log DROP CONSTRAINT library_read_log_user_id_book_id_key;
       public                 bookshy    false    237    237            �           2606    30110 "   matching_books matching_books_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.matching_books
    ADD CONSTRAINT matching_books_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.matching_books DROP CONSTRAINT matching_books_pkey;
       public                 bookshy    false    233            �           2606    16842    matching matching_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.matching
    ADD CONSTRAINT matching_pkey PRIMARY KEY (match_id);
 @   ALTER TABLE ONLY public.matching DROP CONSTRAINT matching_pkey;
       public                 bookshy    false    227            �           2606    34054 ,   library_read_log uk2s79wh40untrdaqvtcb63f16o 
   CONSTRAINT     s   ALTER TABLE ONLY public.library_read_log
    ADD CONSTRAINT uk2s79wh40untrdaqvtcb63f16o UNIQUE (user_id, book_id);
 V   ALTER TABLE ONLY public.library_read_log DROP CONSTRAINT uk2s79wh40untrdaqvtcb63f16o;
       public                 bookshy    false    237    237            �           2606    36284 .   exchange_requests uk_3dn93pxmc25n0uwdfgs0711st 
   CONSTRAINT     q   ALTER TABLE ONLY public.exchange_requests
    ADD CONSTRAINT uk_3dn93pxmc25n0uwdfgs0711st UNIQUE (chat_room_id);
 X   ALTER TABLE ONLY public.exchange_requests DROP CONSTRAINT uk_3dn93pxmc25n0uwdfgs0711st;
       public                 bookshy    false    215            �           2606    29954 %   chat_room uk_ldkcrcykqgmmafcfe1i82f9r 
   CONSTRAINT     d   ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT uk_ldkcrcykqgmmafcfe1i82f9r UNIQUE (match_id);
 O   ALTER TABLE ONLY public.chat_room DROP CONSTRAINT uk_ldkcrcykqgmmafcfe1i82f9r;
       public                 bookshy    false    225            �           2606    16852    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 bookshy    false    229            �           1259    16884    uq_user_isbn    INDEX     N   CREATE UNIQUE INDEX uq_user_isbn ON public.books USING btree (user_id, isbn);
     DROP INDEX public.uq_user_isbn;
       public                 bookshy    false    223    223            �           2606    29955 %   chat_room fk2bmy1x4ulpchgxiqykny26tx8    FK CONSTRAINT     �   ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT fk2bmy1x4ulpchgxiqykny26tx8 FOREIGN KEY (match_id) REFERENCES public.matching(match_id);
 O   ALTER TABLE ONLY public.chat_room DROP CONSTRAINT fk2bmy1x4ulpchgxiqykny26tx8;
       public               bookshy    false    227    225    3298            �           2606    30121 *   matching_books fk2tpe98lg4imed6hnt1wyfaagu    FK CONSTRAINT     �   ALTER TABLE ONLY public.matching_books
    ADD CONSTRAINT fk2tpe98lg4imed6hnt1wyfaagu FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 T   ALTER TABLE ONLY public.matching_books DROP CONSTRAINT fk2tpe98lg4imed6hnt1wyfaagu;
       public               bookshy    false    3300    233    229            �           2606    16874 %   libraries fk9o3aof433waq4oq9od7qfq0ah    FK CONSTRAINT     �   ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT fk9o3aof433waq4oq9od7qfq0ah FOREIGN KEY (book_id) REFERENCES public.books(book_id);
 O   ALTER TABLE ONLY public.libraries DROP CONSTRAINT fk9o3aof433waq4oq9od7qfq0ah;
       public               bookshy    false    219    3291    223            �           2606    32994 2   exchange_reviews_books fkbkdie6k7buyb1geo5a3ro0o4e    FK CONSTRAINT     �   ALTER TABLE ONLY public.exchange_reviews_books
    ADD CONSTRAINT fkbkdie6k7buyb1geo5a3ro0o4e FOREIGN KEY (review_id) REFERENCES public.exchange_requests_reviews(review_id);
 \   ALTER TABLE ONLY public.exchange_reviews_books DROP CONSTRAINT fkbkdie6k7buyb1geo5a3ro0o4e;
       public               bookshy    false    235    3285    217            �           2606    16869 !   books fkcykkh3hxh89ammmwch0gw5o1s    FK CONSTRAINT     �   ALTER TABLE ONLY public.books
    ADD CONSTRAINT fkcykkh3hxh89ammmwch0gw5o1s FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 K   ALTER TABLE ONLY public.books DROP CONSTRAINT fkcykkh3hxh89ammmwch0gw5o1s;
       public               bookshy    false    223    3300    229            �           2606    30116 *   matching_books fkg06e7qfkd9blxg8nxuq9a64ab    FK CONSTRAINT     �   ALTER TABLE ONLY public.matching_books
    ADD CONSTRAINT fkg06e7qfkd9blxg8nxuq9a64ab FOREIGN KEY (match_id) REFERENCES public.matching(match_id);
 T   ALTER TABLE ONLY public.matching_books DROP CONSTRAINT fkg06e7qfkd9blxg8nxuq9a64ab;
       public               bookshy    false    3298    227    233            �           2606    16879 %   libraries fkii9s3dpbrehajshdirhol0asr    FK CONSTRAINT     �   ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT fkii9s3dpbrehajshdirhol0asr FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 O   ALTER TABLE ONLY public.libraries DROP CONSTRAINT fkii9s3dpbrehajshdirhol0asr;
       public               bookshy    false    219    229    3300            �           2606    30111 *   matching_books fkj3b8j776fbta1n9xy5vqpefbs    FK CONSTRAINT     �   ALTER TABLE ONLY public.matching_books
    ADD CONSTRAINT fkj3b8j776fbta1n9xy5vqpefbs FOREIGN KEY (book_id) REFERENCES public.books(book_id);
 T   ALTER TABLE ONLY public.matching_books DROP CONSTRAINT fkj3b8j776fbta1n9xy5vqpefbs;
       public               bookshy    false    233    223    3291            �           2606    36285 -   exchange_requests fkl32pygvkgro3kgji4n57b74nq    FK CONSTRAINT     �   ALTER TABLE ONLY public.exchange_requests
    ADD CONSTRAINT fkl32pygvkgro3kgji4n57b74nq FOREIGN KEY (chat_room_id) REFERENCES public.chat_room(id);
 W   ALTER TABLE ONLY public.exchange_requests DROP CONSTRAINT fkl32pygvkgro3kgji4n57b74nq;
       public               bookshy    false    225    3294    215            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x�͚ێ�֕���OQ/ �>p�P�`���3)J�� ��A�(��+{��8A23�L؉�qx��d�y��tWc��U]�Vw���2PjU��*u����׿��%)R���+��0[�$<���p�+,\!��
|	�ғ��y��?�����O����W��ɟ��~��������WO~�~����������\\���'_|��[��������W���d��� �����Ǌ�L��Uu\�މ{lo=���7b�����F����'�Gc�.[�v4m��I����gQ�w$`�8����ɺ%�ѡpU5��4OF�lo�X|K1X��*��dwuy�nX�5_�fX	��2Y��Rf��G%���?ۡ����vIr�@3�m&+w�9V|iZ���j���n`U��唬���ۆ;r�ⴘf�+T苅9������[�q��.4�,��%w�5!�yg��i��#ao�5��[G������������- z�lXHx��Ѩ�tm`u�����pШ��"c_�Z��v��,�;�����`�d-�#�\��؃5���j�X�]u5�
A��rh�7�h6<pV����\8�NT� �q��X� �+��`{�� ^�~Uǳ�	%��q|�+��B�B����_���LQ��>x��/^��_�s�������۟<��'�����?��Ӓ��7����O+��-��/ːf��@��-�M��c{�ω�)w�����*�Ѻ�7�A(��d?���w��,j�c^[�z}Ȗ}n�tpp��zju�x�d���^��I�FЕ�Q�14y�ť����(]4�ɦ���C�x8R�������Q*�j)�����^��l
fL���:׌�28��9�볼��5�]�`�pm�̂X-Ƃ�5����Ы��P&c���<~�*$��{_/!wE *��虞�+��)� L��+B��
�LB\z���׏?�f=�ٟ/��'o?~�/���TU��˒�[=^���{�Z�7�/����,I�e&�ʝ�j.NEd%N:#K=�'�Gαݑ�8���'OfL�q̚��Xj�q��%�j��H-0���H�r�p������*��g�k���Q'N0�����/�g��V��ͥ��⤯LF�t	#uHz)��i���h��	�����ۉ��]J���gpNd� "�fA��Έ,�A�l	����M+K&>;��m�m�^��(�3kᠡ7�Ǔ�p#N�`����4���Q�.��P�)ġ�a�o�\��i(�;��w�H��+���@̱�<B\��O���O]Le�b�+���+�d�+]��-*��,��G�ߦ;L(��u��7U��s�T��,��g].�!����Ҹ�V�~�l�.7��j���j���}I���j�@�8S!��K��I���rQ�d��\vi�?Ʌ=N�\/��@n�_:��`��L[LOj�z�o9}X��u4�a��k���T�c�;�ѭ��@������A��%F8�x�a*�g�} ��xm�,���-]���W���T�'?{����ɻ�\?��W��~������ß���������8u��T�>��~�#�lOV����7C�D�6߼a����8�.�����p=����$6�.|w�,�(�6�pW=�=�DM->9��*5����^o�j�[���z�u�`�����t;�P'�b��.�f�ޕS�l9��d��۩�5�FiU��'���&�ehy�A@h��=W�]���Z~Y?°D��s� �`� �q��s6���
WV8��7W�KO>{���w�����+�W�z�m��S�!2`*�Jkv^q���^��c\�`0DCeTf�e��aC�~51����m�:}|@XA�PX�� ����Dt.N,n���EV�t:J
��'�v�ہ�P坎�Ӛ�B���>ӵ3ƨ�,m`�4�ui�!��ʻ�<�6��N�q?�W�M:n�X���;���@������0z1���q+U1h�I�u`YI��$յ����B��N0y]A���@��dO,`\�D`�� x��ɻP�8�	�	���^����������� <}���ӂ���d�g��Aa���a����:f�ih<��[c�R��N��R��Fy�N��qo�S�z��O��BЂY\�؉�h;S�Q6��~3���,1�1�V�s��rd4�٤��U�i��O�ٮ�y��t�L��z�M���F$>�Ҡ�w͚v�����5+;ڦȭ���ݗ��8ԕ��<����!�4j���q֣��:h�(�Q&+�\���q��y����d�
� ?Z���j2�Fv����Y�m��A�Z��f�'[6��ؖ�(�J���r���a� �&H��#Ĕ��' ڶxz�Զx�C��(Q�r�Gߕ�^���'�� ׾��Q�g���3{L1��:�}�i�iB�k�w���{^$���َ��ةe͛���=���Ã"�@y�f�9r4�J�R�����v��j�:͢X�Xш��c'^����%�b܎�%������̈́����fC�l` �х2�h\Y���X�[=}���?�����!�ו]��r�-�.�oz�4�9����H}�XTPY'�/�yQ�� H�Eoa��e,5cP�M�����ښ����S�J��6[y~l��v�z�Tuc�lj�R��L�=�踆o;%�#<ϼ+���Ĝo���L� ��F�T����q�t�����~�
&?~��?��]\��������nRC;��~�l�^���jݘ�a������\)��ޡg���zWie����MҎQ�-����LdP̹A)�bX��JK�MI�[b�y=]���m�U�ipS>�lۃ���K���G������nE�na��zr 8�׭~�G��A���mG����"N  ��J�?B�#ܴDr���,Q�B��`���3�
��2&���}�֓�}���#m�}�ww������.ʉbc�.^��a͉Ȟ�Ά�wb��%mN>���� �4�C��n6z��Zf�u�w�9����-�[�D�q�E�?��e��k�T���AqT����<����Jo��l�c�����T�T�T�������	A��Kg3����ϯ?�����3��5�@�SK7�B��j�U��pX��I֋w=�!�w	���µ�NLf5��ѶK��6��K*��v�ޑLr{�&�kqu��x�Q9Sz�ym�7��**ۛx���!��ȑ�ro\��(��f6�I�wE����]8��@��K���1:���sE��8,�B��J6E~,մv��[���9�{-�F�����8{[˶�"Q�I�t��6��W���֞L<30�߫Օo�(�J�]Ԉ1b��@� ?B�t��t���\�_���!��D���#�޻~����?z���F�����?�6F�����蘒F���tF��� z��h�Ψp��'�&G���Es=�����-gH�Lf3T���iW��Z|z<7�w�8�2;��V�[-�&jkU�{�l�ڋ!��\�P�^8%<'* 3�),a!U.���W�}|�΅���1W�9� r�����^e`�(}>6A~����_�6�E�4�3/��2�
�6���F6�R�U�0��|�vG�W5d]��,�p�6Õ�Δ�V��Md2��{�2��	����؝�E��zM`�9Y:I}�#Z[�p���
SS��7����0OO�!~�!+'��啮����o=���gmC����MT��\n����Aa.�)o%����S%h�[>�垄a#z��G��f�A�䔈s�����O4`�B���k���*���mS}]�ʭ�U/F���^�bm��f��CM�ڻc/�[��(0�u��*DZ�p��֜�=3�,�BH��¤��y|�QL��-	��_���O���������V}�J&q]*7�t^]/�W����zN۷����r���3�Z(i���sCs�IX֩�9�=�;R~�Ts�)��-p�=t;�T��t���c����K"X���I'�[��#�uѐ���$�d�%�n_ F=��iuk(zwD��$6�6���a��})}� M  8b�Ac��4��T�;���Ҭ
�c%�9nHzuF��-�4��#]ҳ#��ɘ�g��9��n�J���̰Neg�V��M�N���;b��g�n<�p���cM�-'61m\l�{�\:�̇_��7���כ}��B����}L��a�����dLC^��vъj͢ónV����A��������v���ML��!�noc���_r�6Lՠ�2
��ڷ��>2��`$���r��q#���W�c������o��j.���_|�z� Û��@�'v����$��#����r��u�N��]o�aN%f d�,7�~���#z>}��=<h4�AAǽ�(T:c����hv"o�������������U�ڐM~<�;J2��v��|�@�o�3���|��]7���s�"��jy, 7d�sR���3�2G<B<�?�w����f.�E�>�w�蟙�d��������go}G4�k���Mɿ�)��93�Q#c95�^�2º�->�h�ig��j���{��FO|�>,�)���4�����]��Ԃ!��\e��u�a�yb�r�J�	Ú�9mq��������(-�q��
Kg���=0���P;N��):|��Я�Ԇ!܍��K���[/���Q�G�"أ�X� J�Tv>�]�;�5�nC?��ա.�^��M�54��=�E��esm8nh64�M�`ϛ��ق^�E���������ҽ����SY���ߗ�Ș�u<�sS�4�~+Z��퐝ZW�����j����w���I�z��!i����^�n�ca阳��^ۘ�v�vX���?�X��y�ٛ+2�"�]�φj���7���3���
SX��։R���ޢҫS�{6��9�� ����t���WD��n4��R�UYJ6jЩ���]/�x�v5��f]�)�-[р(p;�WWE3�+mk3�"�j����Vw
���y��ý��ߩ��F�_�DE�����`�A���B3�?��<g�7N]1�)�����A��
��9R�JO���������y՜�-�詮@����6�y���I:εz�OC�.�kˬf>�Ik���v�#��-l�����MM�	�ZRst�iR��gF��!ܴ��=�n��V�];����4�+��`�a\�>�����J����}��)�:ÛZ�fRft�/�3��e`K7mf������`9XgP�<�Z�m�6y�}Ԩ_��%/�t�C���H_��o�5Ԁ�+�a����U�g�;	W˸��Ѥ=�ך�Ӎ����8eH�6{���5F��@(�U�:�֛S<(Kc`����z7���Y�^��V=z���p,     