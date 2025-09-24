import { View, Modal, Pressable, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import CancelModalIcon from "@/assets/svgs/CancelIcon.svg";
import ApplyImmediatelyIcon from "@/assets/svgs/ApplyImeediatelyIcon.svg";
import ApplyNextMonthIcon from "@/assets/svgs/ApplyNextMonthIcon.svg";
import Button from "@/common/Button";
import DateDropdownIcon from "@/assets/svgs/DateDropDownIcon.svg";

type BillingOption = "immediate" | "next_month";

type SetBillingCycleModalProps = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: (option: BillingOption, date?: Date) => void;
  initialOption?: BillingOption;
  initialDate?: Date | null;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function SetBillingCycleModal({
  value,
  setValue,
  onConfirm,
  initialOption = "next_month",
  initialDate,
}: SetBillingCycleModalProps) {
  const [selectedOption, setSelectedOption] = useState<BillingOption>(initialOption);
  
  // Helper function to get default date (next month, first day)
  const getDefaultDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    return nextMonth;
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDate && initialDate instanceof Date && !isNaN(initialDate.getTime())) {
      return initialDate;
    }
    return getDefaultDate();
  });
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = initialDate && initialDate instanceof Date && !isNaN(initialDate.getTime()) 
      ? initialDate 
      : getDefaultDate();
    return date.getMonth();
  });
  
  const [currentYear, setCurrentYear] = useState(() => {
    const date = initialDate && initialDate instanceof Date && !isNaN(initialDate.getTime()) 
      ? initialDate 
      : getDefaultDate();
    return date.getFullYear();
  });
  
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Update state when modal opens with new initial values
  useEffect(() => {
    if (value) {
      setSelectedOption(initialOption);
      
      let dateToUse;
      if (initialDate && initialDate instanceof Date && !isNaN(initialDate.getTime())) {
        dateToUse = initialDate;
      } else {
        dateToUse = getDefaultDate();
      }
      
      setSelectedDate(dateToUse);
      setCurrentMonth(dateToUse.getMonth());
      setCurrentYear(dateToUse.getFullYear());
    }
  }, [value, initialOption, initialDate]);

  const generateYears = () => {
    const currentYearValue = new Date().getFullYear();
    const years = [];
    for (let i = currentYearValue; i <= currentYearValue + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const years = generateYears();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(
      currentMonth === 0 ? 11 : currentMonth - 1,
      currentMonth === 0 ? currentYear - 1 : currentYear
    );

    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }

    // Next month's leading days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
      });
    }

    return days;
  };

  const handleDateSelect = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      try {
        const newDate = new Date(currentYear, currentMonth, day);
        
        // Validate the created date
        if (isNaN(newDate.getTime())) {
          console.error("Invalid date created:", { currentYear, currentMonth, day });
          return;
        }
        
        // Don't allow selecting past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (newDate >= today) {
          setSelectedDate(newDate);
          console.log("Date selected:", newDate);
        }
      } catch (error) {
        console.error("Error creating date:", error);
      }
    }
  };

  const handleConfirm = () => {
    console.log("Modal handleConfirm - selectedOption:", selectedOption);
    console.log("Modal handleConfirm - selectedDate:", selectedDate);
    
    if (onConfirm) {
      // Only pass the date if next_month is selected and we have a valid date
      if (selectedOption === "next_month" && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        onConfirm(selectedOption, selectedDate);
      } else if (selectedOption === "immediate") {
        onConfirm(selectedOption);
      } else {
        // Fallback case - if something went wrong with the date, use default
        const fallbackDate = getDefaultDate();
        onConfirm(selectedOption, fallbackDate);
      }
    }
    
    setValue(false);
  };

  const handleClose = () => {
    setValue(false);
    closeDropdowns();
  };

  const calendarDays = generateCalendarDays();
  
  const isDateSelected = (day: number) => {
    if (!selectedDate || !(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      return false;
    }
    
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    const dayDate = new Date(currentYear, currentMonth, day);
    return dayDate < today;
  };

  const closeDropdowns = () => {
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setShowMonthDropdown(false);
    
    // Update selected date to first day of new month, but keep it valid
    try {
      const newDate = new Date(currentYear, monthIndex, 1);
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      }
    } catch (error) {
      console.error("Error updating date for new month:", error);
    }
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setShowYearDropdown(false);
    
    // Update selected date to first day of new year/month, but keep it valid
    try {
      const newDate = new Date(year, currentMonth, 1);
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      }
    } catch (error) {
      console.error("Error updating date for new year:", error);
    }
  };

  return (
    <Modal
      visible={value}
      onRequestClose={handleClose}
      animationType="slide"
      transparent
    >
      <Pressable
        className="bg-[#2D222033]/20 z-50 flex-1 justify-end"
        onPress={handleClose}
      >
        <Pressable
          className="bg-white rounded-tl-[8px] rounded-tr-[18px] px-[20px] py-[24px] max-h-[90%]"
          onPress={(e) => {
            e.stopPropagation();
            closeDropdowns();
          }}
        >
          <View className="h-[6px] w-[50px] bg-[#EAECF0] rounded-[27px] mx-auto" />

          <ScrollView showsVerticalScrollIndicator={false} className="">
            <View className="mt-[11px]">
              {/* Header */}
              <View className="flex-row items-center justify-between">
                <Text className="text-[18px] leading-[20px] text-[#181818] font-urbanist-bold">
                  Set billing cycle
                </Text>
                <Pressable
                  className="rounded-full bg-[#F7F8F7] h-[32px] w-[32px] items-center justify-center"
                  onPress={handleClose}
                >
                  <CancelModalIcon />
                </Pressable>
              </View>

              {/* Apply Immediately Option */}
              <Pressable
                className="mt-[20px] flex-row items-center justify-between border-b border-[#F1EAE7] pb-[16px]"
                onPress={() => {
                  setSelectedOption("immediate");
                  closeDropdowns();
                }}
              >
                <View className="flex-row items-center gap-[12px]">
                  <View className="rounded-full bg-[#F2F4F7] h-[34px] w-[34px] items-center justify-center">
                    <ApplyImmediatelyIcon />
                  </View>
                  <Text className="text-[14px] leading-[20px] font-urbanist-semibold text-[#181818]">
                    Apply immediately
                  </Text>
                </View>
                <View
                  className={`border-[2px] w-[18px] h-[18px] items-center justify-center rounded-[7px] ${
                    selectedOption === "immediate"
                      ? "border-[#0C513F]"
                      : "border-[#D0D5DD]"
                  }`}
                >
                  {selectedOption === "immediate" && (
                    <View className="bg-[#0C513F] h-[8px] w-[8px] rounded-[100px]" />
                  )}
                </View>
              </Pressable>

              {/* Apply Next Month Option */}
              <Pressable
                className="flex-row items-center justify-between py-[16px]"
                onPress={() => {
                  setSelectedOption("next_month");
                  closeDropdowns();
                }}
              >
                <View className="flex-row items-center gap-[12px]">
                  <View className="rounded-full bg-[#F2F4F7] h-[34px] w-[34px] items-center justify-center">
                    <ApplyNextMonthIcon />
                  </View>
                  <Text className="text-[14px] leading-[20px] font-urbanist-semibold text-[#181818]">
                    Apply next month
                  </Text>
                </View>
                <View
                  className={`border-[2px] w-[18px] h-[18px] rounded-[7px] items-center justify-center ${
                    selectedOption === "next_month"
                      ? "border-[#0C513F]"
                      : "border-[#D0D5DD]"
                  }`}
                >
                  {selectedOption === "next_month" && (
                    <View className="bg-[#0C513F] h-[8px] w-[8px] rounded-[100px]" />
                  )}
                </View>
              </Pressable>

              {/* Calendar - Only show when "Apply next month" is selected */}
              {selectedOption === "next_month" && (
                <View className="mt-[16px] border border-[#B6C1CA] rounded-[16px] p-[16px] relative">
                  {/* Month/Year Selector */}
                  <View className="flex-row justify-end gap-[8px] items-center mb-[16px] relative z-20">
                    {/* Month Selector */}
                    <View className="relative">
                      <Pressable
                        className="px-[12px] py-[8px] rounded-[8px] flex-row items-center min-w-[159px] border border-[#DCE0E5]"
                        onPress={() => {
                          setShowMonthDropdown(!showMonthDropdown);
                          setShowYearDropdown(false);
                        }}
                      >
                        <Text className="text-[14px] font-urbanist-semibold text-[#181818] mr-[4px] flex-1">
                          {MONTHS[currentMonth]}
                        </Text>
                        <DateDropdownIcon />
                      </Pressable>

                      {/* Month Dropdown */}
                      {showMonthDropdown && (
                        <View className="absolute top-[44px] left-0 right-0 bg-white rounded-[8px] border border-[#EAECF0] max-h-[200px] z-50 shadow-lg">
                          <ScrollView>
                            {MONTHS.map((month, index) => (
                              <Pressable
                                key={month}
                                className={`px-[16px] py-[12px] border-b border-[#F1F1F1] ${
                                  index === currentMonth ? "bg-[#F0F9FF]" : ""
                                }`}
                                onPress={() => handleMonthChange(index)}
                              >
                                <Text
                                  className={`text-[14px] ${
                                    index === currentMonth
                                      ? "font-urbanist-semibold text-[#0C513F]"
                                      : "font-urbanist-medium text-[#181818]"
                                  }`}
                                >
                                  {month}
                                </Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Year Selector */}
                    <View className="relative">
                      <Pressable
                        className="px-[12px] py-[8px] border border-[#DCE0E5] rounded-[8px] flex-row items-center min-w-[85px]"
                        onPress={() => {
                          setShowYearDropdown(!showYearDropdown);
                          setShowMonthDropdown(false);
                        }}
                      >
                        <Text className="text-[15px] font-urbanist-medium text-[#14181F] mr-[4px] flex-1">
                          {currentYear}
                        </Text>
                        <DateDropdownIcon />
                      </Pressable>

                      {/* Year Dropdown */}
                      {showYearDropdown && (
                        <View className="absolute top-[44px] left-0 right-0 bg-white rounded-[8px] border border-[#EAECF0] max-h-[200px] z-50 shadow-lg">
                          <ScrollView>
                            {years.map((year) => (
                              <Pressable
                                key={year}
                                className={`px-[16px] py-[12px] border-b border-[#F1F1F1] ${
                                  year === currentYear ? "bg-[#F0F9FF]" : ""
                                }`}
                                onPress={() => handleYearChange(year)}
                              >
                                <Text
                                  className={`text-[14px] ${
                                    year === currentYear
                                      ? "font-urbanist-semibold text-[#0C513F]"
                                      : "font-urbanist-medium text-[#14181F]"
                                  }`}
                                >
                                  {year}
                                </Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Weekday Headers */}
                  <View className="flex-row justify-between mb-[8px]">
                    {WEEKDAYS.map((weekday) => (
                      <View key={weekday} className="w-[40px] items-center">
                        <Text className="text-[15px] font-inter text-[#6F7C8E]">
                          {weekday}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View>
                    {Array.from(
                      { length: Math.ceil(calendarDays.length / 7) },
                      (_, weekIndex) => (
                        <View
                          key={weekIndex}
                          className="flex-row justify-between mb-[4px]"
                        >
                          {calendarDays
                            .slice(weekIndex * 7, (weekIndex + 1) * 7)
                            .map((dayInfo, dayIndex) => {
                              const isPast = dayInfo.isCurrentMonth && isPastDate(dayInfo.day);
                              return (
                                <Pressable
                                  key={dayIndex}
                                  className={`w-[36px] h-[36px] items-center justify-center rounded-[12px] ${
                                    dayInfo.isCurrentMonth &&
                                    isDateSelected(dayInfo.day)
                                      ? "bg-[#0C513F]"
                                      : dayInfo.isCurrentMonth && !isPast
                                      ? "bg-transparent"
                                      : "bg-transparent"
                                  }`}
                                  onPress={() => {
                                    handleDateSelect(
                                      dayInfo.day,
                                      dayInfo.isCurrentMonth
                                    );
                                    closeDropdowns();
                                  }}
                                  disabled={!dayInfo.isCurrentMonth || isPast}
                                >
                                  <Text
                                    className={`text-[15px] font-urbanist-medium ${
                                      dayInfo.isCurrentMonth &&
                                      isDateSelected(dayInfo.day)
                                        ? "text-white"
                                        : dayInfo.isCurrentMonth && !isPast
                                        ? "text-[#14181F]"
                                        : isPast
                                        ? "text-[#B0B0B0]"
                                        : "text-[#6F7C8E]"
                                    }`}
                                  >
                                    {dayInfo.day}
                                  </Text>
                                </Pressable>
                              );
                            })}
                        </View>
                      )
                    )}
                  </View>

                  {/* Calendar Action Buttons */}
                  <View className="flex-row justify-end mt-[16px] gap-[8px] border-t border-[#DCE0E5] pt-[12px]">
                    <Pressable
                      className="px-[16px] py-[8px] rounded-[6px]"
                      onPress={handleClose}
                    >
                      <Text className="text-[14px] font-urbanist-medium text-[#667085]">
                        Cancel
                      </Text>
                    </Pressable>

                    <Pressable
                      className="px-[16px] py-[8px] bg-[#0C513F] rounded-[6px]"
                      onPress={handleConfirm}
                    >
                      <Text className="text-[14px] font-urbanist-semibold text-white">
                        Done
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Confirm Limit Button - Always visible at bottom */}
          <View className="mt-[20px] pt-[16px] pb-10">
            <Button
              title="Confirm limit"
              onPress={handleConfirm}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}