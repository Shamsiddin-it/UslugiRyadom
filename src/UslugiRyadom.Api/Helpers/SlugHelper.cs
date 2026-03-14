using System.Text;
using System.Text.RegularExpressions;

namespace UslugiRyadom.Api.Helpers;

public static partial class SlugHelper
{
    private static readonly Dictionary<char, string> TransliterationMap = new()
    {
        ['а'] = "a", ['б'] = "b", ['в'] = "v", ['г'] = "g", ['д'] = "d",
        ['е'] = "e", ['ё'] = "e", ['ж'] = "zh", ['з'] = "z", ['и'] = "i",
        ['й'] = "y", ['к'] = "k", ['л'] = "l", ['м'] = "m", ['н'] = "n",
        ['о'] = "o", ['п'] = "p", ['р'] = "r", ['с'] = "s", ['т'] = "t",
        ['у'] = "u", ['ф'] = "f", ['х'] = "h", ['ц'] = "ts", ['ч'] = "ch",
        ['ш'] = "sh", ['щ'] = "sch", ['ъ'] = string.Empty, ['ы'] = "y", ['ь'] = string.Empty,
        ['э'] = "e", ['ю'] = "yu", ['я'] = "ya", ['қ'] = "q", ['ғ'] = "g",
        ['ҳ'] = "h", ['ҷ'] = "j", ['ӯ'] = "u", ['ӣ'] = "i"
    };

    public static string Generate(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var builder = new StringBuilder();

        foreach (var character in value.Trim().ToLowerInvariant())
        {
            if (TransliterationMap.TryGetValue(character, out var replacement))
            {
                builder.Append(replacement);
                continue;
            }

            builder.Append(character);
        }

        var normalized = builder.ToString();
        normalized = NonAlphaNumericRegex().Replace(normalized, "-");
        normalized = MultiDashRegex().Replace(normalized, "-");

        return normalized.Trim('-');
    }

    [GeneratedRegex("[^a-z0-9]+", RegexOptions.Compiled)]
    private static partial Regex NonAlphaNumericRegex();

    [GeneratedRegex("-{2,}", RegexOptions.Compiled)]
    private static partial Regex MultiDashRegex();
}
