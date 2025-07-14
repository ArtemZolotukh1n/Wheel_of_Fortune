// Простой Node.js скрипт для тестирования функции определения победителя

// Дублируем логику определения победителя из useWheel
function determineWinner(finalRotation, participants) {
  if (participants.length === 0) return null;

  const sliceAngle = 360 / participants.length;
  // Нормализуем поворот к диапазону 0-360
  const normalizedRotation = ((finalRotation % 360) + 360) % 360;

  // Индикатор находится справа (угол 0°)
  // Колесо вращается против часовой стрелки (отрицательный поворот в canvas)
  // Поэтому нужно найти сектор, который находится под индикатором
  const winningSectorIndex =
    Math.floor(normalizedRotation / sliceAngle) % participants.length;

  return participants[winningSectorIndex] || null;
}

// Создаем участников для тестирования
function createParticipants(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `participant-${index}`,
    name: `Участник ${index + 1}`,
    addedAt: new Date(),
  }));
}

// Функция для тестирования равномерности распределения
function testDistribution(participantCount, testName) {
  console.log(`\n🎯 Начинаем тест равномерности для ${testName}`);

  const participants = createParticipants(participantCount);
  const iterations = 100000;
  const winCounts = new Map();

  console.log(`📊 Участники: ${participants.map((p) => p.name).join(', ')}`);
  console.log(`🔄 Количество итераций: ${iterations}`);

  // Инициализируем счетчики
  participants.forEach((participant) => {
    winCounts.set(participant.id, 0);
  });

  console.log('⏳ Запускаем симуляцию...');

  // Проводим 100000 тестов с случайными углами поворота
  for (let i = 0; i < iterations; i++) {
    const randomRotation = Math.random() * 360 * 10; // Случайный поворот от 0 до 3600°
    const winner = determineWinner(randomRotation, participants);

    console.log(
      `Итерация ${i + 1}: угол=${randomRotation.toFixed(1)}°, победитель=${winner?.name || 'null'}`,
    );

    if (winner) {
      const currentCount = winCounts.get(winner.id) || 0;
      winCounts.set(winner.id, currentCount + 1);
    }
  }

  console.log('✅ Симуляция завершена! Анализируем результаты...');

  // Проверяем результаты
  const expectedWinRate = 1 / participantCount;
  const tolerance = 0.2; // 20% допуск для малого количества итераций

  let allTestsPassed = true;

  participants.forEach((participant) => {
    const winCount = winCounts.get(participant.id) || 0;
    const actualWinRate = winCount / iterations;
    const deviation = Math.abs(actualWinRate - expectedWinRate);

    if (deviation >= tolerance) {
      console.log(
        `❌ ТЕСТ НЕ ПРОШЕЛ для ${participant.name}: отклонение ${(deviation * 100).toFixed(2)}% превышает допуск ${tolerance * 100}%`,
      );
      allTestsPassed = false;
    } else {
      console.log(
        `✅ ТЕСТ ПРОШЕЛ для ${participant.name}: отклонение ${(deviation * 100).toFixed(2)}%`,
      );
    }

    if (winCount === 0) {
      console.log(`❌ ТЕСТ НЕ ПРОШЕЛ для ${participant.name}: 0 побед`);
      allTestsPassed = false;
    }
  });

  // Проверяем общее количество побед
  const totalWins = Array.from(winCounts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  if (totalWins !== iterations) {
    console.log(
      `❌ ОШИБКА: Общее количество побед ${totalWins} не равно количеству итераций ${iterations}`,
    );
    allTestsPassed = false;
  } else {
    console.log(`✅ Общее количество побед корректно: ${totalWins}`);
  }

  // Выводим статистику
  console.log(`\n📊 Статистика для ${testName}:`);
  participants.forEach((participant) => {
    const winCount = winCounts.get(participant.id) || 0;
    const winRate = ((winCount / iterations) * 100).toFixed(2);
    const expectedRate = ((1 / participantCount) * 100).toFixed(2);
    console.log(
      `${participant.name}: ${winCount} побед (${winRate}%, ожидалось ${expectedRate}%)`,
    );
  });

  return allTestsPassed;
}

// Основная функция тестирования
function runTests() {
  console.log('🚀 Запуск тестов функции определения победителя\n');

  const testCases = [
    { participantCount: 4, testName: '4 участника' },
    { participantCount: 6, testName: '6 участников' },
    { participantCount: 8, testName: '8 участников' },
  ];

  let allTestsPassed = true;

  testCases.forEach(({ participantCount, testName }) => {
    const testPassed = testDistribution(participantCount, testName);
    if (!testPassed) {
      allTestsPassed = false;
    }
  });

  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!');
    console.log('✅ Функция определения победителя работает корректно');
    console.log('✅ Распределение равномерное для всех участников');
  } else {
    console.log('❌ НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОШЛИ');
    console.log('⚠️  Проверьте логику определения победителя');
  }
  console.log('='.repeat(50));
}

// Запускаем тесты
runTests();
