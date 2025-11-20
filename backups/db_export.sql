--
-- PostgreSQL database dump
--

\restrict GAB0XMTc59DBBRfWaWZduzHP9X2Zp4Y3GEIyLIgx3YxwVccAOOAugAeIM6Duaxn

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: leaderboard; Type: TABLE; Schema: public; Owner: quiz
--

CREATE TABLE public.leaderboard (
    id integer NOT NULL,
    name text NOT NULL,
    sector text NOT NULL,
    score integer NOT NULL,
    date timestamp with time zone NOT NULL
);


ALTER TABLE public.leaderboard OWNER TO quiz;

--
-- Name: leaderboard_id_seq; Type: SEQUENCE; Schema: public; Owner: quiz
--

CREATE SEQUENCE public.leaderboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.leaderboard_id_seq OWNER TO quiz;

--
-- Name: leaderboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: quiz
--

ALTER SEQUENCE public.leaderboard_id_seq OWNED BY public.leaderboard.id;


--
-- Name: leaderboard id; Type: DEFAULT; Schema: public; Owner: quiz
--

ALTER TABLE ONLY public.leaderboard ALTER COLUMN id SET DEFAULT nextval('public.leaderboard_id_seq'::regclass);


--
-- Data for Name: leaderboard; Type: TABLE DATA; Schema: public; Owner: quiz
--

COPY public.leaderboard (id, name, sector, score, date) FROM stdin;
1	fff	DETI	2	2025-11-04 15:22:02.077+00
2	fff	DETI	2	2025-11-04 16:18:34.103+00
3	fff	DETI	2	2025-11-04 16:21:12.971+00
4	fff	DETI	10	2025-11-04 16:27:33.445+00
5	JPSA	DETI	3	2025-11-04 18:42:53.475+00
6	teste	teste	3	2025-11-04 18:57:11.082+00
7	Claudio	Assis	2	2025-11-04 19:02:16.41+00
8	gh	hdahf	2	2025-11-10 18:28:43.207+00
9	JPSA	DEIRC	3	2025-11-10 18:36:53.873+00
10	Automated	Dev	42	2025-11-20 21:17:23.25943+00
11	fff	DETI	2	2025-11-04 15:22:02.077+00
12	fff	DETI	2	2025-11-04 16:18:34.103+00
13	fff	DETI	2	2025-11-04 16:21:12.971+00
14	fff	DETI	10	2025-11-04 16:27:33.445+00
15	JPSA	DETI	3	2025-11-04 18:42:53.475+00
16	teste	teste	3	2025-11-04 18:57:11.082+00
17	Claudio	Assis	2	2025-11-04 19:02:16.41+00
18	gh	hdahf	2	2025-11-10 18:28:43.207+00
19	JPSA	DEIRC	3	2025-11-10 18:36:53.873+00
20	Automated	Dev	42	2025-11-20 21:17:23.25943+00
21	E2E Test	QA	5	2025-11-20 22:14:29.245517+00
22	João	Abreu	2	2025-11-20 22:16:38.723847+00
\.


--
-- Name: leaderboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: quiz
--

SELECT pg_catalog.setval('public.leaderboard_id_seq', 22, true);


--
-- Name: leaderboard leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: quiz
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict GAB0XMTc59DBBRfWaWZduzHP9X2Zp4Y3GEIyLIgx3YxwVccAOOAugAeIM6Duaxn

