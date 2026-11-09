# Rubric (from base/criteria.pdf, transcribed 2026-11-09)

> Read when: deciding priorities or checking a rule's points. Key fact: about 90 of 100 points need the engine;
> importing earns 4. For build order, skip to "Ranked by what earns the points".
> Written from the guide in criteria.md. When the rubric changes, rewrite this file from that guide.

Competition: AI technology skills, ปวส. level. Full score 100.
Scoring rule: fully correct = full points · partly done = proportional · **cannot be verified = 0**.
Note on the form: constraints that truly conflict (no timetable possible) are judged fairly on the evidence of
analysis and the cause report.

| ID | Pts | Thai (original) | English |
|---|---|---|---|
| **1** | **40** | **ความถูกต้องตามข้อกำหนดการจัดตารางสอน** | **Timetable rule compliance** |
| 1.1 | 3 | นักเรียน ปวช. เรียนไม่เกินคาบ 9 และระดับอื่นไม่เกินคาบ 11 | ปวช. ends by period 9, other levels by 11 |
| 1.2 | 3 | จัดพักกลางวัน 1 ชั่วโมง ในคาบ 4, 5 หรือ 6 | one-hour lunch break in period 4, 5 or 6 |
| 1.3 | 3 | วิชากิจกรรมและลูกเสืออยู่วันพฤหัสบดี คาบ 6–7 | activity and scout courses on Thursday periods 6-7 |
| 1.4 | 3 | วิชาทฤษฎีเรียนรวม 2 กลุ่ม และวิชาปฏิบัติแยกกลุ่ม 1, 2 ตามกำหนด | theory: both groups together · practical: groups 1 and 2 separate |
| 1.5 | 3 | ภาระสอนครูเป็นไปตามเกณฑ์ตำแหน่ง (หัวหน้า 24–28 ชม. / ครูประจำ 30–38 ชม.) | teacher load by position (heads 24-28 h, instructors 30-38 h) |
| 1.6 | 3 | ใช้ห้อง COM1–COM4 และ LAB1–LAB2 ถูกประเภท และไม่ใช้ห้องซ้อน | COM1-4 / LAB1-2 used by correct type, no room double-booked |
| 1.7 | 3 | จัดคาบเรียนของแต่ละรายวิชาต่อเนื่อง ไม่ฉีกชั่วโมง | each course's periods consecutive, hours not split |
| 1.8 | 5 | ครูผู้สอนไม่มีตารางสอนซ้อนกัน | no teacher clash |
| 1.9 | 5 | นักเรียนแต่ละกลุ่มไม่มีตารางเรียนซ้อนกัน | no student-group clash |
| 1.10 | 3 | ครูและห้องเรียนไม่มีการจัดสอนในช่วงที่ไม่พร้อม | no teacher or room used while unavailable |
| 1.11 | 3 | นักเรียนเริ่มเรียนคาบ 1 และไม่มีคาบว่างระหว่างวิชา ยกเว้นพักกลางวัน | start at period 1, no gaps except lunch |
| 1.12 | 3 | ปฏิบัติตามข้อกำหนดเฉพาะรายวิชา วันและคาบเรียนที่ระบุในโจทย์ | course-specific day/period requirements honoured |
| **2** | **15** | **ความครบถ้วนและคุณภาพของตารางสอน** | **Timetable completeness and quality** |
| 2.1 | 6 | จัดรายวิชาและจำนวนคาบได้ครบตามข้อมูลที่กำหนด | every course and every period scheduled |
| 2.2 | 3 | ตารางเรียนรายกลุ่มถูกต้อง ครบถ้วน และต่อเนื่อง | per-group timetables correct, complete, continuous |
| 2.3 | 3 | ตารางสอนรายครูครบถ้วนและตรวจสอบภาระสอนได้ | per-teacher timetables complete, load checkable |
| 2.4 | 3 | ตารางการใช้ห้องเรียนครบถ้วนและสัมพันธ์กับตารางสอน | room timetables complete and consistent with the teaching timetable |
| **3** | **15** (form says 35) | **ความสามารถและการทำงานของระบบ** | **System capability** |
| 3.1 | 4 | นำเข้าข้อมูลรายวิชา ครู ห้อง เวลา และโจทย์จากกรรมการได้ | import courses, teachers, rooms, times and the judges' problem |
| 3.2 | 4 | สามารถจัดตารางสอนอัตโนมัติตามเงื่อนไข | generate the timetable automatically under the constraints |
| 3.3 | 3 | ตรวจสอบความขัดแย้งและรายงานสาเหตุที่จัดไม่ได้ | detect conflicts, report why it can't be scheduled |
| 3.4 | 2 | แสดงตารางสอนแยกตามครู ห้องเรียน นักเรียน และรายวิชา | views by teacher, room, student group and course |
| 3.5 | 2 | ส่งออกรายงาน Excel และ PDF | export Excel and PDF |
| **4** | **20** | **การประยุกต์ใช้เทคนิคปัญญาประดิษฐ์ (AI)** | **Applying AI techniques** |
| 4.1 | 2 | เลือกเทคนิค AI หรืออัลกอริทึมเหมาะสมกับโจทย์ | suitable AI technique or algorithm chosen |
| 4.2 | 2 | อธิบายหลักการทำงานและเหตุผลที่เลือกใช้ | explain how it works and why it was chosen |
| 4.3 | 2 | นำเทคนิคที่เลือกไปใช้จัดตารางสอนได้จริง | the technique really produces the timetable |
| 4.4 | 2 | วิเคราะห์เงื่อนไขและวางแผนการทำงาน (Plan) | analyse constraints and plan (Plan) |
| 4.5 | 2 | ดำเนินการจัดตารางตามแผน (Act) | schedule according to the plan (Act) |
| 4.6 | 2 | อธิบายขั้นตอน ค่าตั้งต้น และเงื่อนไขสำคัญได้ | explain steps, initial values, key conditions |
| 4.7 | 2 | การใช้อัลกอริทึมประเมินและเลือกตารางสอนที่เหมาะสม | algorithm evaluates and selects a suitable timetable |
| 4.8 | 2 | แสดงหลักฐานการลดข้อขัดแย้งหรือเพิ่มคุณภาพตาราง | evidence of fewer conflicts or better quality |
| 4.9 | 2 | มีแนวคิดประยุกต์ที่เพิ่มคุณค่าแก่ระบบ | an applied idea that adds value |
| 4.10 | 2 | สามารถนำแนวคิดไปใช้จริงหรือต่อยอดได้ | the idea is usable in practice or extendable |
| **5** | **10** | **การนำเสนอและการตรวจสอบผลงาน** | **Presentation and verification** |
| 5.1 | 4 | อธิบายแนวคิด หลักการ และขั้นตอนการทำงานของระบบจัดตารางสอน | explain the system's concept, principles and steps |
| 5.2 | 6 | สาธิตการจัดตารางสอน และแสดงผลการทำงานจริง | live demo of scheduling with real results |

Section 3's heading on the form says 35, but its items add up to 15. With 15, the sections total 40+15+15+20+10 = 100,
the stated full score.

## Ranked by what earns the points (build order follows this)

| Rank | What must exist | Items | Pts |
|---|---|---|---|
| 0 | Basic import of the judges' file (.xlsx). Earns little itself, but nothing else runs without it | 3.1 | 4 |
| 1 | Engine: a valid, complete timetable | 1.1-1.12, 2.1, 3.2 | 50 |
| 2 | The AI method, explained, with before/after quality evidence | 4.1-4.10 | 20 |
| 3 | Demo and explanation of the system | 5.1, 5.2 | 10 |
| 4 | Group / teacher / room / course timetables | 2.2-2.4, 3.4 | 11 |
| 5 | Conflict check + "why it can't be scheduled" report | 3.3 | 3 |
| 6 | Excel and PDF export | 3.5 | 2 |

About 90 of the 100 points need the engine. Importing extra formats (PDF, OCR, .xls, .csv, multi-file) earns nothing beyond item 3.1.

## Where the old plan disagrees with the rubric
- 1.7 says don't split a course's hours. The old plan allows splitting into blocks of 2-4 periods.
- 1.3 (activity/scout on Thursday 6-7) is not an engine rule in the old plan. It only holds if the uploaded text says so.
- 4.7 and 4.8 need a scoring/improvement step. The old plan has it ON HOLD.
- "Cannot be verified = 0": every rule must be visibly checkable in the demo, for example by the validator's report.
