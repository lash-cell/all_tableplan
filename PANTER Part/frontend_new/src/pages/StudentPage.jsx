import { useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { STUDENT_GROUPS, ROOMS, getBlocksForView } from "../features/home/home-data";
import { TimetableGrid } from "../features/home/TimetableGrid";

export default function StudentPage() {
    const [selectedGroup, setSelectedGroup] = useState(STUDENT_GROUPS[0]);
    const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
    const blocks = useMemo(() => getBlocksForView("student", selectedRoom, selectedGroup), [selectedRoom, selectedGroup]);

    return (<AppShell>
      <header className="hm-head tt-enter">
        <h1>ตารางนักเรียน</h1>
        <p>นักเรียนเลือกกลุ่มของตนเองเพื่อดูตารางรายวัน พร้อมห้องเรียนที่ใช้จริง</p>
        <div className="hm-toolbar">
          <label className="hm-search">
            <span>กลุ่ม</span>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} aria-label="เลือกกลุ่มนักเรียน" style={{ border: "none", background: "transparent", width: "100%", font: "inherit", color: "inherit" }}>
              {STUDENT_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
          </label>
          <label className="hm-search">
            <span>ห้อง</span>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} aria-label="เลือกห้องเรียน" style={{ border: "none", background: "transparent", width: "100%", font: "inherit", color: "inherit" }}>
              {ROOMS.map((room) => <option key={room} value={room}>{room}</option>)}
            </select>
          </label>
        </div>
      </header>

      <section className="hm-card" aria-labelledby="student-title">
        <div className="hm-row">
          <h2 id="student-title">ตาราง {selectedGroup} · {selectedRoom}</h2>
        </div>
        <TimetableGrid label={`ตารางกลุ่ม ${selectedGroup}`} blocks={blocks} view="student" roomFilter={selectedRoom} studentGroup={selectedGroup} />
      </section>
    </AppShell>);
}