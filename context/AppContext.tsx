import { createContext, useContext, useState, ReactNode } from 'react';
import { styles } from '../lib/styles';

type Style = {
  name: string;
  design: string;
  typography: string;
  visual: string;
};

type Input = {
  title: string;
  content: string;
  background?: string;
};

type Generated = {
  prompt: string;
  image?: string;
  code?: string;
};

type HistoryItem = {
  input: Input;
  style: Style;
  platform: string;
  generated: Generated;
  timestamp: number;
};

type AppContextType = {
  input: Input;
  setInput: (input: Input) => void;
  style: Style;
  setStyle: (style: Style) => void;
  platform: string;
  setPlatform: (platform: string) => void;
  generated: Generated;
  setGenerated: (generated: Generated) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<Input>({
    title: '',
    content: '',
  });
  const [style, setStyle] = useState<Style>(styles[0]);
  const [platform, setPlatform] = useState('xiaohongshu');
  const [generated, setGenerated] = useState<Generated>({
    prompt: '',
  });
  const [apiKey, setApiKey] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (item: Omit<HistoryItem, 'timestamp'>) => {
    const historyItem: HistoryItem = {
      ...item,
      timestamp: Date.now(),
    };
    setHistory((prev) => [historyItem, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        input,
        setInput,
        style,
        setStyle,
        platform,
        setPlatform,
        generated,
        setGenerated,
        apiKey,
        setApiKey,
        history,
        addToHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}