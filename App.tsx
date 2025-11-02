
import React, { useState, useCallback } from 'react';
import IntroductionScreen from './components/IntroductionScreen';
import KarnatakaScreen from './components/KarnatakaScreen';

type Screen = 'introduction' | 'karnataka';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('introduction');

  const navigateToKarnataka = useCallback(() => {
    setScreen('karnataka');
  }, []);

  const navigateToIntro = useCallback(() => {
    setScreen('introduction');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-teal-900 font-sans">
      <main className="container mx-auto max-w-3xl h-screen flex flex-col p-4">
        {screen === 'introduction' ? (
          <IntroductionScreen onNavigate={navigateToKarnataka} />
        ) : (
          <KarnatakaScreen onNavigate={navigateToIntro} />
        )}
      </main>
    </div>
  );
};

export default App;
