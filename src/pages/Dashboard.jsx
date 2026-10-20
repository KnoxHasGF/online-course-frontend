
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";

const emptyForm = {
  courseName: "",
  duration: "30",
  topics: "",
  price: "0",
  maxStudent: "20",
  status: "Open",
};

function courseToForm(course) {
  return {
    courseName: course.courseName,
    duration: String(course.duration),
    topics: (course.topics || []).join(", "),
    price: String(course.price),
    maxStudent: String(course.maxStudent),
    status: course.status,
  };
}

export default function Dashboard() {
  const { user, logout, apiRequest } = useContext(UserContext);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyCourse, setBusyCourse] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isStudent = user?.role === "Student";
  const isTeacher = user?.role === "Teacher";

  async function loadCourses() {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/course");
      setCourses(result.courses || []);

      if (isStudent) {
        const enrolled = await apiRequest("/api/course/enrolled");
        setEnrolledCourses(enrolled.courses || []);
      }
    } catch (err) {
      setError(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, [user?.role]);

  function updateForm(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function startEdit(course) {
    setEditingId(course._id);
    setForm(courseToForm(course));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function saveCourse(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      courseName: form.courseName.trim(),
      duration: Number(form.duration),
      topics: form.topics.split(",").map((topic) => topic.trim()).filter(Boolean),
      price: Number(form.price),
      maxStudent: Number(form.maxStudent),
      status: form.status,
    };

    try {
      const path = editingId
        ? `/api/course/${editingId}`
        : "/api/course";

      const result = await apiRequest(path, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setMessage(
        result.message ||
          (editingId ? "Course updated successfully." : "Course created successfully.")
      );
      setEditingId(null);
      setForm(emptyForm);
      await loadCourses();
    } catch (err) {
      setError(err.message || "Could not save course.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(course) {
    const confirmed = window.confirm(
      `Delete "${course.courseName}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusyCourse(course._id);
    setMessage("");
    setError("");

    try {
      const result = await apiRequest(`/api/course/${course._id}`, {
        method: "DELETE",
      });
      setMessage(result.message || "Course deleted successfully.");

      if (editingId === course._id) cancelEdit();

      await loadCourses();
    } catch (err) {
      setError(err.message || "Could not delete course.");
    } finally {
      setBusyCourse("");
    }
  }

  async function viewStudents(courseId) {
    setBusyCourse(courseId);
    setMessage("");
    setError("");

    try {
      const result = await apiRequest(`/api/course/${courseId}`);
      setStudentsByCourse((previous) => ({
        ...previous,
        [courseId]: result.students || [],
      }));
    } catch (err) {
      setError(err.message || "Could not load enrolled students.");
    } finally {
      setBusyCourse("");
    }
  }

  async function enroll(courseId) {
    setBusyCourse(courseId);
    setMessage("");
    setError("");

    try {
      const result = await apiRequest(`/api/course/${courseId}/enroll`, {
        method: "POST",
      });
      setMessage(result.message || "Enrollment successful.");
      await loadCourses();
    } catch (err) {
      setError(err.message || "Enrollment failed.");
    } finally {
      setBusyCourse("");
    }
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">ONLINE COURSE SERVICE</p>
          <h1>Welcome, {user?.username}</h1>
          <p>Role: {user?.role}</p>
        </div>
        <button onClick={logout}>Log out</button>
      </header>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {isTeacher && (
        <section className="dashboard-card">
          <h2>{editingId ? "Edit course" : "Create a course"}</h2>

          <form onSubmit={saveCourse}>
            <label>
              Course name
              <input
                name="courseName"
                value={form.courseName}
                onChange={updateForm}
                required
              />
            </label>

            <label>
              Duration
              <input
                name="duration"
                type="number"
                min="1"
                value={form.duration}
                onChange={updateForm}
                required
              />
            </label>

            <label>
              Topics (separate with commas)
              <input
                name="topics"
                value={form.topics}
                onChange={updateForm}
                placeholder="HTML, CSS, JavaScript"
                required
              />
            </label>

            <label>
              Price
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateForm}
                required
              />
            </label>

            <label>
              Maximum students
              <input
                name="maxStudent"
                type="number"
                min="1"
                value={form.maxStudent}
                onChange={updateForm}
                required
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={updateForm}
              >
                <option value="Open">Open</option>
                <option value="Close">Close</option>
                <option value="Cancel">Cancel</option>
              </select>
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create course"}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel editing
              </button>
            )}
          </form>
        </section>
      )}

      <section className="dashboard-card">
        <h2>{isTeacher ? "My courses" : "Available courses"}</h2>

        {loading && <p>Loading courses...</p>}
        {!loading && courses.length === 0 && <p>No courses found.</p>}

        <div className="course-list">
          {courses.map((course) => {
            const id = course._id;
            const alreadyEnrolled = enrolledCourses.some(
              (item) => item._id === id
            );
            const students = studentsByCourse[id];

            return (
              <article className="course-card" key={id}>
                <h3>{course.courseName}</h3>
                <p>Duration: {course.duration}</p>
                <p>Price: {course.price}</p>
                <p>Status: {course.status}</p>
                <p>Maximum students: {course.maxStudent}</p>
                <p>Topics: {(course.topics || []).join(", ")}</p>

                {isTeacher && (
                  <div className="course-actions">
                    <button onClick={() => startEdit(course)}>
                      Edit
                    </button>

                    <button
                      disabled={busyCourse === id}
                      onClick={() => deleteCourse(course)}
                    >
                      {busyCourse === id ? "Please wait..." : "Delete"}
                    </button>

                    <button
                      disabled={busyCourse === id}
                      onClick={() => viewStudents(id)}
                    >
                      View enrolled students
                    </button>
                  </div>
                )}

                {isTeacher && students && (
                  <div>
                    <h4>Enrolled students ({students.length})</h4>
                    {students.length === 0 ? (
                      <p>No students enrolled yet.</p>
                    ) : (
                      <ul>
                        {students.map((student) => (
                          <li key={student._id}>
                            {student.username} — {student.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {isStudent && (
                  alreadyEnrolled ? (
                    <p>You're enrolled in this course.</p>
                  ) : (
                    <button
                      disabled={
                        busyCourse === id || course.status !== "Open"
                      }
                      onClick={() => enroll(id)}
                    >
                      {busyCourse === id ? "Enrolling..." : "Enroll"}
                    </button>
                  )
                )}
              </article>
            );
          })}
        </div>
      </section>

      {isStudent && (
        <section className="dashboard-card">
          <h2>My enrolled courses</h2>
          {enrolledCourses.length ? (
            <ul>
              {enrolledCourses.map((course) => (
                <li key={course._id}>
                  {course.courseName} — {course.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not enrolled in any courses yet.</p>
          )}
        </section>
      )}
    </main>
  );
}
