const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  try {
    if (ag.course_id !== course.id) {
      throw new Error("Invalid AssignmentGroup for the provided CourseInfo");
    }

    const assignmentsById = {};
    ag.assignments.forEach((assign) => {
      assignmentsById[assign.id] = assign;
    });

    // console.log(assignmentsById);
    const learners = {};

    submissions.forEach((sub) => {
      try {
        const learner_id = sub.learner_id;
        const assignment_id = sub.assignment_id;
        const submitted_at = sub.submission.submitted_at;
        const score = sub.submission.score;
        const assignment = assignmentsById[assignment_id];

        if (!assignment || isNaN(score) || assignment.points_possible === 0) {
          throw new Error("Invalid data encountered");
        }

        if (new Date(assignment.due_at) > new Date()) {
          return;
        }

        if (!learners[learner_id]) {
          learners[learner_id] = {
            id: learner_id,
            totalScore: 0,
            totalPossiblePoints: 0,
            assignments: {},
          };
        }

        let finalScore = score;
        if (new Date(submitted_at) > new Date(assignment.due_at)) {
          finalScore *= 0.9;
        }

        learners[learner_id].totalScore += finalScore;
        learners[learner_id].totalPossiblePoints += assignment.points_possible;
        learners[learner_id].assignments[assignment_id] =
          finalScore / assignment.points_possible;

        // console.log(learners)
      } catch (err) {
        console.error(err.message);
      }
    });

    const results = [];
    for (const learnerId in learners) {
      const learner = learners[learnerId];
      const avg =
        learner.totalPossiblePoints === 0
          ? 0
          : learner.totalScore / learner.totalPossiblePoints;
      const result = { id: learner.id, avg };

      for (const assignmentId in learner.assignments) {
        result[assignmentId] = learner.assignments[assignmentId];
      }

      results.push(result);
    }

    return results;
  } catch (e) {
    console.error(e.message);
    return [];
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
