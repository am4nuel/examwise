// Differential update endpoint for exams - only updates what changed
router.patch('/exams/:id/differential', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ],
      transaction
    });
    
    if (!exam) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Exam not found' });
    }

    const { examData, questionsToUpdate, questionsToAdd, questionsToDelete, choicesToUpdate, choicesToAdd, choicesToDelete } = req.body;

    // Update exam metadata if provided
    if (examData) {
      await exam.update(examData, { transaction });
    }

    // Delete questions
    if (questionsToDelete && questionsToDelete.length > 0) {
      await Question.destroy({
        where: { id: questionsToDelete },
        transaction
      });
    }

    // Update existing questions
    if (questionsToUpdate && questionsToUpdate.length > 0) {
      for (const q of questionsToUpdate) {
        await Question.update(q, {
          where: { id: q.id },
          transaction
        });
      }
    }

    // Add new questions
    if (questionsToAdd && questionsToAdd.length > 0) {
      const newQuestions = questionsToAdd.map(q => ({
        ...q,
        examId: exam.id
      }));
      await Question.bulkCreate(newQuestions, { transaction });
    }

    // Delete choices
    if (choicesToDelete && choicesToDelete.length > 0) {
      await Choice.destroy({
        where: { id: choicesToDelete },
        transaction
      });
    }

    // Update existing choices
    if (choicesToUpdate && choicesToUpdate.length > 0) {
      for (const c of choicesToUpdate) {
        await Choice.update(c, {
          where: { id: c.id },
          transaction
        });
      }
    }

    // Add new choices
    if (choicesToAdd && choicesToAdd.length > 0) {
      await Choice.bulkCreate(choicesToAdd, { transaction });
    }

    await transaction.commit();

    // Return updated exam
    const updatedExam = await Exam.findByPk(exam.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: Choice, as: 'choices' }]
        }
      ]
    });

    res.json(updatedExam);
  } catch (error) {
    await transaction.rollback();
    console.error('Differential update error:', error);
    res.status(400).json({ message: error.message });
  }
});

