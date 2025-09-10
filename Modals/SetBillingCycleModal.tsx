import { View, Modal, Pressable, Text, ScrollView } from "react-native";
import { useState } from "react";
import CancelModalIcon from "@/assets/svgs/CancelIcon.svg";
import ApplyImmediatelyIcon from "@/assets/svgs/ApplyImeediatelyIcon.svg";
import ApplyNextMonthIcon from "@/assets/svgs/ApplyNextMonthIcon.svg";
import Button from "@/common/Button";
import DateDropdownIcon from "@/assets/svgs/DateDropDownIcon.svg";

type SetBillingCycleModalProps = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type BillingOption = "immediate" | "next_month";

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
  setShowSuccessModal,
}: SetBillingCycleModalProps) {
  const [selectedOption, setSelectedOption] =
    useState<BillingOption>("next_month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const generateYears = () => {
    const currentYearValue = new Date().getFullYear();
    const years = [];
    for (let i = currentYearValue - 10; i <= currentYearValue + 10; i++) {
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
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

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
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
    }
  };

  const handleConfirm = () => {
    console.log("Selected option:", selectedOption);
    if (selectedOption === "next_month") {
      console.log("Selected date:", selectedDate);
    }
    setValue(false);
  };

  const calendarDays = generateCalendarDays();
  const isDateSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const closeDropdowns = () => {
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  return (
    <Modal
      visible={value}
      onRequestClose={() => setValue(!value)}
      animationType="slide"
      transparent
    >
      <Pressable
        className="bg-[#2D222033]/20 z-50 flex-1 justify-end "
        onPress={() => setValue(false)}
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
                  onPress={() => setValue(false)}
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
                <View className="mt-[16px] border border-[#B6C1CA] rounded-[16px] p-[16px] relative  ">
                  {/* Month/Year Selector */}
                  <View className="flex-row justify-end gap-[8px] items-center mb-[16px] relative z-20">
                    {/* Month Selector */}
                    <View className="relative">
                      <Pressable
                        className="px-[12px] py-[8px] rounded-[8px] flex-row items-center min-w-[159px] border border-[#DCE0E5]  "
                        onPress={() => {
                          setShowMonthDropdown(!showMonthDropdown);
                          setShowYearDropdown(false);
                        }}
                      >
                        <Text className="text-[14px] font-urbanist-semibold text-[#181818] mr-[4px] flex-1 ">
                          {MONTHS[currentMonth]}
                        </Text>
                        <DateDropdownIcon />
                      </Pressable>

                      {/* Month Dropdown */}
                      {showMonthDropdown && (
                        <View className="absolute top-[44px] left-0 right-0 bg-white rounded-[8px] border border-[#EAECF0] max-h-[200px] z-50 shadow-lg  ">
                          <ScrollView>
                            {MONTHS.map((month, index) => (
                              <Pressable
                                key={month}
                                className={`px-[16px] py-[12px] border-b border-[#F1F1F1] ${
                                  index === currentMonth ? "bg-[#F0F9FF]" : ""
                                }`}
                                onPress={() => {
                                  setCurrentMonth(index);
                                  setShowMonthDropdown(false);
                                }}
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
                        className="px-[12px] py-[8px] border border-[#DCE0E5] rounded-[8px] flex-row items-center min-w-[85px] "
                        onPress={() => {
                          setShowYearDropdown(!showYearDropdown);
                          setShowMonthDropdown(false);
                        }}
                      >
                        <Text className="text-[15px] font-urbanist-medium text-[#14181F] mr-[4px] flex-1 ">
                          {currentYear}
                        </Text>
                        <DateDropdownIcon />
                      </Pressable>

                      {/* Year Dropdown */}
                      {showYearDropdown && (
                        <View className="absolute top-[44px] left-0 right-0 bg-white rounded-[8px] border border-[#EAECF0] max-h-[200px] z-50 shadow-lg ">
                          <ScrollView>
                            {years.map((year) => (
                              <Pressable
                                key={year}
                                className={`px-[16px] py-[12px] border-b border-[#F1F1F1] ${
                                  year === currentYear ? "bg-[#F0F9FF]" : ""
                                }`}
                                onPress={() => {
                                  setCurrentYear(year);
                                  setShowYearDropdown(false);
                                }}
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
                            .map((dayInfo, dayIndex) => (
                              <Pressable
                                key={dayIndex}
                                className={`w-[36px] h-[36px] items-center justify-center rounded-[12px] ${
                                  dayInfo.isCurrentMonth &&
                                  isDateSelected(dayInfo.day)
                                    ? "bg-[#0C513F]"
                                    : dayInfo.isCurrentMonth
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
                                disabled={!dayInfo.isCurrentMonth}
                              >
                                <Text
                                  className={`text-[15px] font-urbanist-medium ${
                                    dayInfo.isCurrentMonth &&
                                    isDateSelected(dayInfo.day)
                                      ? "text-white"
                                      : dayInfo.isCurrentMonth
                                      ? "text-[#14181F]"
                                      : "text-[#6F7C8E]"
                                  }`}
                                >
                                  {dayInfo.day}
                                </Text>
                              </Pressable>
                            ))}
                        </View>
                      )
                    )}
                  </View>

                  {/* Calendar Action Buttons */}
                  <View className="flex-row justify-end mt-[16px] gap-[8px] border-t border-[#DCE0E5] pt-[12px] ">
                    <Pressable
                      className="px-[16px] py-[8px] rounded-[6px] "
                      onPress={() => setValue(false)}
                    >
                      <Text className="text-[14px] font-urbanist-medium text-[#667085]  ">
                        Cancel
                      </Text>
                    </Pressable>

                    <Pressable
                      className="px-[16px] py-[8px] bg-[#0C513F] rounded-[6px]  "
                      onPress={handleConfirm}
                    >
                      <Text className="text-[14px] font-urbanist-semibold text-white ">
                        Done
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Confirm Limit Button - Always visible at bottom */}
          <View className="mt-[20px] pt-[16px] pb-10  ">
            <Button
              title="Confirm limit"
              onPress={() => {
                handleConfirm();
                setShowSuccessModal((prev) => !prev);
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
