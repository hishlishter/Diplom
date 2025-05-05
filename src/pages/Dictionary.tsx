import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Book } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const YANDEX_DICT_API_KEY = "";
const YANDEX_DICT_API_URL = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup";

interface DictionaryResponse {
    def: {
        text: string;
        pos: string;
        ts?: string;
        tr: {
            text: string;
            pos: string;
            syn?: { text: string; pos: string }[];
            mean?: { text: string }[];
            ex?: { text: string; tr: { text: string }[] }[];
        }[];
    }[];
}

type TranslationDirection = 'en-ru' | 'ru-en';

const Dictionary = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchProgress, setSearchProgress] = useState(0);
    const [searchResult, setSearchResult] = useState<DictionaryResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [direction, setDirection] = useState<TranslationDirection>('en-ru');

    // Handle search
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        setSearchProgress(0);
        setSearchResult(null);
        setError(null);
        
        try {
            // Start progress animation
            const progressInterval = setInterval(() => {
                setSearchProgress((prev) => {
                    const newProgress = prev + 20;
                    if (newProgress >= 90) {
                        return 90; // Hold at 90% until data loads
                    }
                    return newProgress;
                });
            }, 200);
            
            // Construct API URL
            const url = new URL(YANDEX_DICT_API_URL);
            url.searchParams.append('key', YANDEX_DICT_API_KEY);
            url.searchParams.append('lang', direction); // Direction of translation
            url.searchParams.append('text', searchQuery.trim());
            
            // Fetch data from Yandex Dictionary API
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`API returned status code ${response.status}`);
            }
            
            const data: DictionaryResponse = await response.json();
            setSearchResult(data);
            
            // Complete progress animation
            clearInterval(progressInterval);
            setSearchProgress(100);
            
            // Reset progress bar after a delay
            setTimeout(() => {
                setIsSearching(false);
                setSearchProgress(0);
            }, 500);
            
        } catch (error) {
            console.error('Error during search:', error);
            setError('Произошла ошибка при поиске в словаре. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
            toast.error('Ошибка при поиске в словаре');
            setIsSearching(false);
            setSearchProgress(0);
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Format part of speech
    const formatPos = (pos: string | undefined): string => {
        if (!pos) return '';
        const posMap: { [key: string]: string } = {
            'noun': 'сущ.',
            'verb': 'гл.',
            'adjective': 'прил.',
            'adverb': 'нареч.',
            'pronoun': 'мест.',
            'preposition': 'предл.',
            'conjunction': 'союз',
            'interjection': 'межд.',
            'article': 'арт.',
            'numeral': 'числ.',
            'particle': 'част.',
            'predicative': 'предик.',
        };
        return posMap[pos] || pos;
    };

    // Render dictionary result
    const renderSearchResult = () => {
        if (!searchResult) return null;
        if (searchResult.def.length === 0) {
            return (
                <div className="my-4 p-4 bg-muted/50 rounded-lg dark:bg-[#232136] dark:text-purple-200">
                    <p>Перевод не найден для {direction === 'en-ru' ? 'английского' : 'русского'} слова "{searchQuery}"</p>
                </div>
            );
        }
        return (
            <div className="space-y-6">
                {searchResult.def.map((definition, defIndex) => (
                    <div key={defIndex} className="border-b pb-4 last:border-0 dark:border-[#393552]">
                        <div className="flex items-baseline gap-2 mb-2">
                            <h3 className="text-lg font-bold text-primary dark:text-fuchsia-400">{definition.text}</h3>
                            {definition.ts && <span className="text-sm text-muted-foreground dark:text-purple-300">[{definition.ts}]</span>}
                            <span className="text-sm italic text-muted-foreground dark:text-purple-300">{formatPos(definition.pos)}</span>
                        </div>
                        <div className="space-y-3">
                            {definition.tr.map((translation, trIndex) => (
                                <div key={trIndex} className="ml-4">
                                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                        <span className="font-medium dark:text-purple-100">{translation.text}</span>
                                        <span className="text-xs italic text-muted-foreground dark:text-purple-300">{formatPos(translation.pos)}</span>
                                    </div>
                                    {translation.syn && translation.syn.length > 0 && (
                                        <div className="ml-4 mb-2">
                                            <span className="text-sm text-muted-foreground dark:text-purple-400">Синонимы: </span>
                                            <span className="text-sm dark:text-purple-200">
                                                {translation.syn.map(s => s.text).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {translation.mean && translation.mean.length > 0 && (
                                        <div className="ml-4 mb-2">
                                            <span className="text-sm text-muted-foreground dark:text-purple-400">Значения: </span>
                                            <span className="text-sm italic dark:text-purple-200">
                                                {translation.mean.map(m => m.text).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {translation.ex && translation.ex.length > 0 && (
                                        <div className="ml-4 space-y-1">
                                            <span className="text-sm text-muted-foreground dark:text-purple-400">Примеры:</span>
                                            <ul className="ml-4 space-y-1">
                                                {translation.ex.map((example, exIndex) => (
                                                    <li key={exIndex} className="text-sm dark:text-purple-200">
                                                        <span className="italic">{example.text}</span>
                                                        {example.tr && example.tr.length > 0 && (
                                                            <span className="text-muted-foreground dark:text-purple-400"> — {example.tr[0].text}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-background">
            <div className="sticky top-0 h-screen z-20">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
                <Header title="Словарь" />
                <main className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="border rounded-2xl p-6 bg-white/90 shadow-md dark:bg-[#232136] dark:text-purple-100 dark:border-[#393552]">
                            <div className="flex items-center gap-4 mb-6">
                                <BookOpen className="h-8 w-8 text-primary dark:text-purple-300" />
                                <h2 className="text-2xl font-semibold">Русско-английский словарь</h2>
                            </div>
                            <div className="space-y-4">
                                <ToggleGroup type="single" value={direction} onValueChange={(value: TranslationDirection) => value && setDirection(value)}>
                                    <ToggleGroupItem value="en-ru" aria-label="English to Russian">
                                        <Book className="h-4 w-4 mr-2" />
                                        Английский → Русский
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="ru-en" aria-label="Russian to English">
                                        <Book className="h-4 w-4 mr-2" />
                                        Русский → Английский
                                    </ToggleGroupItem>
                                </ToggleGroup>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder={`Введите ${direction === 'en-ru' ? 'английское' : 'русское'} слово...`}
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        className="dark:bg-[#2a273f] dark:text-purple-100 dark:border-[#393552] dark:placeholder:text-purple-300"
                                    />
                                    <Button onClick={handleSearch} disabled={isSearching} className="dark:bg-fuchsia-500 dark:text-white dark:hover:bg-fuchsia-600">
                                        <Search className="h-4 w-4 mr-2" />
                                        Найти
                                    </Button>
                                </div>
                                {isSearching && (
                                    <Progress value={searchProgress} className="h-1" />
                                )}
                                {error && (
                                    <div className="text-red-500 dark:text-red-400">{error}</div>
                                )}
                                {renderSearchResult()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dictionary;
